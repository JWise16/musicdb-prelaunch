import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../lib/database.types'
import { Dialog } from '@headlessui/react'
import { XMarkIcon, EyeIcon } from '@heroicons/react/24/outline'

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

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Venue Submissions Dashboard</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search venues..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('venue_name')}
              >
                Venue Name {sortField === 'venue_name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('venue_location')}
              >
                Location {sortField === 'venue_location' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2">Capacity</th>
              <th className="px-4 py-2">Contact Person</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Contact</th>
              <th 
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                Submitted {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission) => (
              <tr key={submission.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{submission.venue_name}</td>
                <td className="px-4 py-2">{submission.venue_location}</td>
                <td className="px-4 py-2">{submission.venue_capacity?.toLocaleString()}</td>
                <td className="px-4 py-2">{`${submission.first_name} ${submission.last_name}`}</td>
                <td className="px-4 py-2">{submission.role_at_venue}</td>
                <td className="px-4 py-2">
                  {submission.contact_method === 'email' ? (
                    <a href={`mailto:${submission.contact_value}`} className="text-blue-600 hover:underline">
                      {submission.contact_value}
                    </a>
                  ) : (
                    <a href={`tel:${submission.contact_value}`} className="text-blue-600 hover:underline">
                      {submission.contact_value}
                    </a>
                  )}
                </td>
                <td className="px-4 py-2">
                  {formatDate(submission.created_at)}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => setSubmissionToView(submission)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSubmissionToDelete(submission)}
                    className="text-red-600 hover:text-red-800"
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!submissionToDelete}
        onClose={() => !isDeleting && setSubmissionToDelete(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-medium">
                Confirm Deletion
              </Dialog.Title>
              <button
                onClick={() => !isDeleting && setSubmissionToDelete(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <Dialog.Description className="mb-4">
              Are you sure you want to delete the submission for {submissionToDelete?.venue_name}? This action cannot be undone.
            </Dialog.Description>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSubmissionToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full rounded bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-medium">
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-500">Venue Information</h3>
                    <p className="mt-1">Name: {submissionToView.venue_name}</p>
                    <p>Location: {submissionToView.venue_location}</p>
                    <p>Capacity: {submissionToView.venue_capacity?.toLocaleString() || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-500">Contact Information</h3>
                    <p className="mt-1">Name: {`${submissionToView.first_name} ${submissionToView.last_name}`}</p>
                    <p>Role: {submissionToView.role_at_venue}</p>
                    <p>Contact: {submissionToView.contact_value} ({submissionToView.contact_method})</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-500">Booking Priorities</h3>
                    <ul className="mt-1 list-disc list-inside">
                      {submissionToView.booking_priorities?.map((priority, index) => (
                        <li key={index}>{priority}</li>
                      ))}
                    </ul>
                    {submissionToView.booking_priorities_other && (
                      <p className="mt-1">Other: {submissionToView.booking_priorities_other}</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-500">Artist Discovery Methods</h3>
                    <ul className="mt-1 list-disc list-inside">
                      {submissionToView.artist_discovery_methods?.map((method, index) => (
                        <li key={index}>{method}</li>
                      ))}
                    </ul>
                    {submissionToView.artist_discovery_other && (
                      <p className="mt-1">Other: {submissionToView.artist_discovery_other}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Submitted: {formatDate(submissionToView.created_at)}
                  </p>
                  {submissionToView.updated_at && (
                    <p className="text-sm text-gray-500">
                      Last Updated: {formatDate(submissionToView.updated_at)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
} 