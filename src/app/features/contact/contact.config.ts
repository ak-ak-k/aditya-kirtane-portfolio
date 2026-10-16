// Current aditya-kirtane-resume.pdf p1 header and contact hyperlink annotations.
export const CONTACT = {
  email: 'adityakirtane27@gmail.com',
  phone: '+91 88797 51140',
  phoneHref: 'tel:+918879751140',
  linkedin: 'https://linkedin.com/in/adityakirtane',
  linkedinLabel: 'linkedin.com/in/adityakirtane',
  location: 'Mumbai, India',
  resumePath: 'assets/resume/aditya-kirtane-resume.pdf',
  portrait: 'assets/images/aditya/portrait-headshot.webp',
  supportingCopy:
    'I’m interested in meaningful products, strong engineering teams, and challenging frontend problems. If you’re building something useful and think I could contribute, let’s connect.',
} as const;

interface ContactCard {
  readonly id: 'email' | 'phone' | 'linkedin' | 'location';
  readonly label: string;
  readonly value: string;
  readonly href: string | null;
  readonly external: boolean;
  readonly icon: `assets/icons/ui/${'mail' | 'phone' | 'linkedin' | 'location'}.svg`;
}
export const CONTACT_CARDS: readonly ContactCard[] = [
  {
    id: 'email',
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    external: false,
    icon: 'assets/icons/ui/mail.svg',
  },
  {
    id: 'phone',
    label: 'Phone',
    value: CONTACT.phone,
    href: CONTACT.phoneHref,
    external: false,
    icon: 'assets/icons/ui/phone.svg',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: CONTACT.linkedinLabel,
    href: CONTACT.linkedin,
    external: true,
    icon: 'assets/icons/ui/linkedin.svg',
  },
  {
    id: 'location',
    label: 'Location',
    value: CONTACT.location,
    href: null,
    external: false,
    icon: 'assets/icons/ui/location.svg',
  },
] as const;
