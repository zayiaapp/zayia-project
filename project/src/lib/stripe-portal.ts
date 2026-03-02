/**
 * Stripe Portal Management
 * Handles creation of customer portal sessions and Stripe integrations
 */

interface CreatePortalSessionResponse {
  url: string
  error?: string
}

/**
 * Create a Stripe Customer Portal session
 * Used by user to manage subscription, payment methods, and billing info
 */
export async function createStripePortalSession(
  customerId: string
): Promise<CreatePortalSessionResponse> {
  try {
    // In production, call backend endpoint:
    // const response = await fetch('/api/stripe/create-portal-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ customerId })
    // })

    // For now, return mock URL
    // This should be replaced with actual Stripe API call
    console.warn('⚠️ Using mock Stripe portal URL. Configure backend endpoint in production.')

    return {
      url: `https://billing.stripe.com/p/login/test_${customerId}`
    }
  } catch (error) {
    console.error('Error creating portal session:', error)
    return {
      url: '',
      error: 'Failed to create portal session'
    }
  }
}

/**
 * Fetch user invoices from Stripe
 * TODO: Integrate with backend to fetch from Stripe API
 */
export async function fetchStripeInvoices(_customerId: string) {
  try {
    // In production:
    // const response = await fetch('/api/stripe/invoices', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ customerId: _customerId })
    // })
    // return response.json()

    console.warn('⚠️ Invoices not yet integrated. Configure backend endpoint in production.')
    return []
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return []
  }
}
