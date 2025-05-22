import React from 'react'
import { AlertTriangle, CheckCircle, Info, AlertCircle, X } from 'lucide-react'

// Define strict types for alert variants
const ALERT_VARIANTS = ['default', 'success', 'warning', 'error', 'info'] as const
export type AlertVariant = (typeof ALERT_VARIANTS)[number]

// Alert variant styles mapping
const alertVariants: Record<AlertVariant, string> = {
  default: 'bg-gray-50 border-gray-200 text-gray-900',
  success: 'bg-green-50 border-green-200 text-green-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
}

// Icons mapping with strict typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const alertIcons: Record<AlertVariant, React.ComponentType<any>> = {
  default: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
}

// Strict prop types for Alert component
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alert variant - determines color scheme and icon */
  variant?: AlertVariant
  /** Additional CSS classes to apply */
  className?: string
  /** Alert content */
  children: React.ReactNode
  /** Callback function when close button is clicked */
  onClose?: () => void
  /** Whether to show the variant icon */
  showIcon?: boolean
}

// Main Alert component with strict typing
export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  className = '',
  children,
  onClose,
  showIcon = true,
  ...props
}) => {
  // Validate variant
  if (!ALERT_VARIANTS.includes(variant)) {
    console.warn(`Invalid alert variant: ${variant}. Using 'default' instead.`)
    variant = 'default'
  }

  const Icon = alertIcons[variant]

  return (
    <div
      className={`relative flex items-start gap-4 p-4 border rounded-lg ${alertVariants[variant]} ${className}`}
      role='alert'
      {...props}
    >
      {showIcon && <Icon className='w-5 h-5 mt-0.5 flex-shrink-0' />}
      <div className='flex-1 min-w-0 pt-0.5'>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className='flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors'
          aria-label='Close alert'
          type='button'
        >
          <X className='w-4 h-4' />
        </button>
      )}
    </div>
  )
}

// Valid heading levels
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

// Strict prop types for AlertTitle
interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Additional CSS classes to apply */
  className?: string
  /** Title content */
  children: React.ReactNode
  /** Heading level for semantic HTML structure */
  as?: HeadingLevel
}

// Alert Title component with flexible heading level
export const AlertTitle: React.FC<AlertTitleProps> = ({
  className = '',
  children,
  as: Component = 'h4',
  ...props
}) => {
  if (!children) {
    console.warn('AlertTitle: children prop is required')
    return null
  }

  return (
    <Component
      className={`font-semibold text-sm mb-1 ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

// Strict prop types for AlertDescription
interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes to apply */
  className?: string
  /** Description content */
  children: React.ReactNode
}

// Alert Description component with strict typing
export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  className = '',
  children,
  ...props
}) => {
  if (!children) {
    console.warn('AlertDescription: children prop is required')
    return null
  }

  return (
    <div
      className={`text-sm opacity-90 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Demo state interface
// interface AlertState {
//   id: number
//   type: string
//   show: boolean
// }

// Demo component with strict typing
// const AlertDemo: React.FC = () => {
//   const [alerts, setAlerts] = React.useState<AlertState[]>([
//     { id: 1, type: 'success', show: true },
//     { id: 2, type: 'warning', show: true },
//     { id: 3, type: 'error', show: true },
//     { id: 4, type: 'info', show: true },
//     { id: 5, type: 'custom', show: true },
//   ])

//   const closeAlert = React.useCallback((id: number): void => {
//     setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, show: false } : alert)))
//   }, [])

//   const resetAlerts = React.useCallback((): void => {
//     setAlerts((prev) => prev.map((alert) => ({ ...alert, show: true })))
//   }, [])

//   const getAlertById = React.useCallback(
//     (id: number): AlertState | undefined => {
//       return alerts.find((a) => a.id === id)
//     },
//     [alerts]
//   )

//   return (
//     <div className='max-w-2xl mx-auto p-6 space-y-6'>
//       <div className='text-center mb-8'>
//         <h1 className='text-3xl font-bold text-gray-900 mb-2'>Alert Component Demo</h1>
//         <p className='text-gray-600'>
//           A composable alert component with strict TypeScript-style typing
//         </p>
//       </div>

//       <div className='space-y-4'>
//         {/* Success Alert with custom heading level */}
//         {getAlertById(1)?.show && (
//           <Alert
//             variant='success'
//             onClose={() => closeAlert(1)}
//           >
//             <AlertTitle as='h2'>Success!</AlertTitle>
//             <AlertDescription>
//               Your changes have been saved successfully. All data is now synchronized.
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Warning Alert */}
//         {getAlertById(2)?.show && (
//           <Alert
//             variant='warning'
//             onClose={() => closeAlert(2)}
//           >
//             <AlertTitle as='h3'>Warning</AlertTitle>
//             <AlertDescription>
//               Your session will expire in 5 minutes. Please save your work to avoid losing changes.
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Error Alert */}
//         {getAlertById(3)?.show && (
//           <Alert
//             variant='error'
//             onClose={() => closeAlert(3)}
//           >
//             <AlertTitle>Error occurred</AlertTitle>
//             <AlertDescription>
//               Failed to upload file. Please check your internet connection and try again.
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Example with HTML attributes */}
//         <Alert
//           variant='info'
//           id='info-alert'
//           data-testid='feature-announcement'
//           aria-describedby='feature-description'
//         >
//           <AlertTitle id='feature-title'>New feature available</AlertTitle>
//           <AlertDescription id='feature-description'>
//             We've added dark mode support. You can enable it in your account settings.
//           </AlertDescription>
//         </Alert>

//         {/* Custom styled alert */}
//         {getAlertById(5)?.show && (
//           <Alert
//             variant='default'
//             className='bg-purple-50 border-purple-200 text-purple-900'
//             showIcon={false}
//             onClose={() => closeAlert(5)}
//           >
//             <AlertTitle className='text-purple-800'>Custom Alert</AlertTitle>
//             <AlertDescription className='text-purple-700'>
//               This alert uses custom Tailwind classes for a unique purple theme without an icon.
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Simple alert without title */}
//         <Alert variant='default'>
//           <AlertDescription>
//             This is a simple alert with just a description and no title.
//           </AlertDescription>
//         </Alert>

//         {/* Alert with only title */}
//         <Alert
//           variant='info'
//           showIcon={false}
//         >
//           <AlertTitle>Just a title, no description needed!</AlertTitle>
//         </Alert>

//         {/* Example of invalid variant (will fallback to default with warning) */}
//         <Alert variant={'invalid' as AlertVariant}>
//           <AlertTitle>Invalid Variant Test</AlertTitle>
//           <AlertDescription>
//             This alert uses an invalid variant and will show a console warning.
//           </AlertDescription>
//         </Alert>
//       </div>

//       {/* Reset button */}
//       <div className='text-center pt-6'>
//         <button
//           onClick={resetAlerts}
//           className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
//           type='button'
//         >
//           Reset All Alerts
//         </button>
//       </div>
//     </div>
//   )
// }
