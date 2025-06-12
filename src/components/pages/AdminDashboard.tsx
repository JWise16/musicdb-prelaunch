import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../lib/database.types'
import { Dialog } from '@headlessui/react'
import { XMarkIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type VenueSubmission = Database['public']['Tables']['venue_submissions']['Row']

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<VenueSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof VenueSubmission>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [submissionToDelete, setSubmissionToDelete] = useState<VenueSubmission | null>(null)
  const [submissionToView, setSubmissionToView] = useState<VenueSubmission | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('venue_submissions')
        .select('*')
        .order(sortField as string, { ascending: sortDirection === 'asc' })

      if (error) throw error
      setSubmissions(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!submissionToDelete) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('venue_submissions')
        .delete()
        .eq('id', submissionToDelete.id)

      if (error) throw error

      // Update local state
      setSubmissions(submissions.filter(s => s.id !== submissionToDelete.id))
      setSubmissionToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete submission')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredSubmissions = submissions.filter(submission => 
    submission.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.venue_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSort = (field: keyof VenueSubmission) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading submissions...</div>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-xl text-red-500">Error: {error}</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Venue Submissions</h1>
          <p className="text-gray-600">Manage and review venue submissions from your pre-launch page.</p>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search venues, locations, or contact names..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('venue_name')}
                  >
                    Venue Name {sortField === 'venue_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('venue_location')}
                  >
                    Location {sortField === 'venue_location' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('created_at')}
                  >
                    Submitted {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {submission.venue_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.venue_location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.venue_capacity?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`${submission.first_name} ${submission.last_name}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.role_at_venue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {submission.contact_method === 'email' ? (
                        <a href={`mailto:${submission.contact_value}`} className="text-indigo-600 hover:text-indigo-900">
                          {submission.contact_value}
                        </a>
                      ) : (
                        <a href={`tel:${submission.contact_value}`} className="text-indigo-600 hover:text-indigo-900">
                          {submission.contact_value}
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(submission.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                      <button
                        onClick={() => setSubmissionToView(submission)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setSubmissionToDelete(submission)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!submissionToDelete}
        onClose={() => !isDeleting && setSubmissionToDelete(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Confirm Deletion
              </Dialog.Title>
              <button
                onClick={() => !isDeleting && setSubmissionToDelete(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <Dialog.Description className="mb-4 text-gray-500">
              Are you sure you want to delete the submission for {submissionToDelete?.venue_name}? This action cannot be undone.
            </Dialog.Description>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSubmissionToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* View Details Modal */}
      <Dialog
        open={!!submissionToView}
        onClose={() => setSubmissionToView(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-medium text-gray-900">
                Submission Details
              </Dialog.Title>
              <button
                onClick={() => setSubmissionToView(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {submissionToView && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Venue Information</h3>
                    <div className="space-y-2 text-gray-600">
                      <p><span className="font-medium">Name:</span> {submissionToView.venue_name}</p>
                      <p><span className="font-medium">Location:</span> {submissionToView.venue_location}</p>
                      <p><span className="font-medium">Capacity:</span> {submissionToView.venue_capacity?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-2 text-gray-600">
                      <p><span className="font-medium">Name:</span> {`${submissionToView.first_name} ${submissionToView.last_name}`}</p>
                      <p><span className="font-medium">Role:</span> {submissionToView.role_at_venue}</p>
                      <p><span className="font-medium">Contact:</span> {submissionToView.contact_value} ({submissionToView.contact_method})</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Booking Priorities</h3>
                    <div className="space-y-2">
                      <ul className="list-disc list-inside text-gray-600">
                        {submissionToView.booking_priorities?.map((priority, index) => (
                          <li key={index}>{priority}</li>
                        ))}
                      </ul>
                      {submissionToView.booking_priorities_other && (
                        <p className="text-gray-600 mt-2">
                          <span className="font-medium">Other:</span> {submissionToView.booking_priorities_other}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Artist Discovery Methods</h3>
                    <div className="space-y-2">
                      <ul className="list-disc list-inside text-gray-600">
                        {submissionToView.artist_discovery_methods?.map((method, index) => (
                          <li key={index}>{method}</li>
                        ))}
                      </ul>
                      {submissionToView.artist_discovery_other && (
                        <p className="text-gray-600 mt-2">
                          <span className="font-medium">Other:</span> {submissionToView.artist_discovery_other}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-500">
                    <p>Submitted: {formatDate(submissionToView.created_at)}</p>
                    {submissionToView.updated_at && (
                      <p>Last Updated: {formatDate(submissionToView.updated_at)}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
} 