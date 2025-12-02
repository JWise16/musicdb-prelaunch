/**
 * Landing Page Use Cases / Features Section
 * All 7 features with alternating layouts
 */

import { 
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  MapPinIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import { useScrollFocus } from '../../hooks/useScrollFocus';

// Import feature images
import calendarImage from '../../assets/landing/feature-images/calendar.webp';
import automateDealCreationImage from '../../assets/landing/feature-images/automate-deal-creation.webp';
import artistInsightsImage from '../../assets/landing/feature-images/artist-insights.webp';
import trackShowsImage from '../../assets/landing/feature-images/track-shows.webp';
import contactsImage from '../../assets/landing/feature-images/contacts.webp';
import permissionsImage from '../../assets/landing/feature-images/permission-and-access.webp';
import analyticsImage from '../../assets/landing/feature-images/analytics.webp';

interface FeatureProps {
  title: string;
  description: string[];
  icon: React.ReactNode;
  badgeColor: string;
  iconColor: string; // Icon color class
  imagePlaceholder: string;
  featureImage?: string; // Optional: real feature image path
  reverse?: boolean; // If true, image on left, text on right
  imageScale?: number; // Optional: custom scale for image (default 1.15)
}

const FeatureRow = ({ title, description, icon, badgeColor, iconColor, imagePlaceholder, featureImage, reverse = false, imageScale = 1.15 }: FeatureProps) => {
  const { ref, isVisible, isInFocus } = useScrollFocus({ 
    focusTop: 0.2, 
    focusBottom: 0.8,
    visibilityThreshold: 0.2 
  });
  
  // Rotation angle: 0 when in focus, rotated when not
  const rotationAngle = reverse ? -8 : 8;
  
  return (
    <div ref={ref} className={`grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center mb-20 md:mb-28 lg:mb-40 ${reverse ? 'lg:grid-flow-dense' : ''}`}>
      {/* Text Content */}
      <div className={`${reverse ? 'lg:col-start-2' : ''} relative z-10 transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-x-0' 
          : `opacity-0 ${reverse ? 'translate-x-10' : '-translate-x-10'}`
      }`}>
        <div className="bg-white rounded-2xl p-5 md:p-6 lg:p-8 shadow-2xl space-y-4 md:space-y-6">
          {/* Icon and Badge */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className={`${iconColor} [&>svg]:w-10 [&>svg]:h-10 md:[&>svg]:w-12 md:[&>svg]:h-12 lg:[&>svg]:w-14 lg:[&>svg]:h-14`}>
              {icon}
            </div>
            <div className={`${badgeColor} text-white px-5 py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 rounded-full font-medium text-base md:text-lg lg:text-xl`}>
              {title}
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-3 md:space-y-4 text-black text-base md:text-lg lg:text-xl leading-relaxed">
            {description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Image or Placeholder */}
      <div className={`${reverse ? 'lg:col-start-1 lg:row-start-1' : ''} overflow-visible transition-all duration-700 ease-out delay-100 ${
        isVisible 
          ? 'opacity-100' 
          : 'opacity-0'
      }`}>
        {featureImage ? (
          <img 
            src={featureImage} 
            alt={`${title} screenshot`}
            className={`w-full h-auto rounded-lg shadow-md transition-all duration-500 ease-out ${
              isVisible ? '' : 'scale-90'
            } ${isInFocus ? 'shadow-2xl' : ''}`}
            style={{ 
              transform: `scale(${isInFocus ? imageScale * 1.05 : imageScale}) rotate(${isInFocus ? 0 : rotationAngle}deg)`,
            }}
          />
        ) : (
          <div className={`w-full aspect-video rounded-lg ${imagePlaceholder} flex items-center justify-center text-gray-500 text-sm p-8`}>
            <span className="text-center">[{title} screenshot placeholder]</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const LandingUseCasesSection = () => {
  const features: FeatureProps[] = [
    {
      title: "Simplify your Calendar",
      description: [
        "A calendar that understands live music. Automatically track holds, confirmations, and more. Quickly be able to filter between different rooms or venues, search for shows on your calendar and easily adjust deal terms when creating events."
      ],
      icon: <CalendarIcon className="w-12 h-12" />,
      badgeColor: "bg-pink-500",
      iconColor: "text-pink-500",
      imagePlaceholder: "bg-pink-100",
      featureImage: calendarImage,
      reverse: false,
      imageScale: 1.05
    },
    {
      title: "Automate Deal Creation",
      description: [
        "From hold to offer in 30 seconds. Apply your deal templates, customize terms, and generate a professional offer instantly. No more rebuilding deals from scratch every time.",
        "Generate settlements based on the original offer just as easily."
      ],
      icon: <DocumentTextIcon className="w-12 h-12" />,
      badgeColor: "bg-green-500",
      iconColor: "text-green-500",
      imagePlaceholder: "bg-green-100",
      featureImage: automateDealCreationImage,
      reverse: true,
      imageScale: 1.05
    },
    {
      title: "Gather Artist Insights",
      description: [
        "See the full artist picture in one place. Check streaming numbers, social engagement, and audience demographics across Instagram, TikTok, Spotify, and SoundCloud and more.",
        "Review their live performance history including where they've played and where they're playing next."
      ],
      icon: <ChartBarIcon className="w-12 h-12" />,
      badgeColor: "bg-blue-500",
      iconColor: "text-blue-500",
      imagePlaceholder: "bg-blue-100",
      featureImage: artistInsightsImage,
      reverse: false,
      imageScale: 1.05
    },
    {
      title: "Track Shows Around You",
      description: [
        "Stop competing with shows you didn't know about.",
        "Track what's happening at venues around you weeks in advance, so you can book smarter and avoid conflicts."
      ],
      icon: <MapPinIcon className="w-12 h-12" />,
      badgeColor: "bg-purple-500",
      iconColor: "text-purple-500",
      imagePlaceholder: "bg-purple-100",
      featureImage: trackShowsImage,
      reverse: true,
      imageScale: 1.05
    },
    {
      title: "Supercharge your Contacts",
      description: [
        "Manage your black book smarter. Add custom notes, track who knows who, and find any email or phone number all in one search."
      ],
      icon: <UserGroupIcon className="w-12 h-12" />,
      badgeColor: "bg-cyan-500",
      iconColor: "text-cyan-500",
      imagePlaceholder: "bg-cyan-100",
      featureImage: contactsImage,
      reverse: false,
      imageScale: 1.05
    },
    {
      title: "Custom Permissions and Access",
      description: [
        "Give your team the access they need. Nothing more, nothing less.",
        "Customizable permissions let you control what each team member sees based on their role. Keep sensitive information secure while empowering your team to do their jobs."
      ],
      icon: <ShieldCheckIcon className="w-12 h-12" />,
      badgeColor: "bg-yellow-500",
      iconColor: "text-yellow-500",
      imagePlaceholder: "bg-yellow-100",
      featureImage: permissionsImage,
      reverse: true,
      imageScale: 1.05
    },
    {
      title: "Analytics at your Fingertips",
      description: [
        "No more piecing together spreadsheets to understand your business.",
        "See revenue, expenses, attendance, and profit trends in one dashboard making it easy to spot what's working and optimize your booking strategy."
      ],
      icon: <PresentationChartLineIcon className="w-12 h-12" />,
      badgeColor: "bg-orange-500",
      iconColor: "text-orange-500",
      imagePlaceholder: "bg-orange-100",
      featureImage: analyticsImage,
      reverse: false,
      imageScale: 1.0
    }
  ];

  return (
    <section id="use-cases" className="pt-12 md:pt-16 lg:pt-20 pb-6 md:pb-8 lg:pb-10 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-20">
        {features.map((feature, index) => (
          <FeatureRow key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

