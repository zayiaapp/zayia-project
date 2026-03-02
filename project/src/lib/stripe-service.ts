/**
 * Stripe Portal Service
 * Handles creation of Stripe Customer Portal sessions
 *
 * IMPORTANT: In production, this should call a backend endpoint that creates the session
 * using Stripe's backend SDK for security reasons (secret key must not be exposed).
 *
 * For now, we provide a mock implementation for development.
 */

/**
 * Create a Stripe Customer Portal session for the user
 * User can manage their subscription, payment methods, and billing info through the portal
 *
 * @param customerId - Stripe Customer ID
 * @returns Portal URL to open in new tab
 */
export async function createStripePortalSession(customerId: string): Promise<string> {
  if (!customerId) {
    throw new Error('customerId é obrigatório')
  }

  try {
    // In production, call your backend endpoint:
    // POST /api/stripe/create-portal-session
    // Body: { customerId }
    // Response: { url: "https://billing.stripe.com/..." }

    // For now, return a mock URL for development
    console.warn(
      '⚠️ Using mock Stripe portal URL for development. Configure backend endpoint in production.'
    )

    // Mock Stripe portal URL - replace with real endpoint when backend is ready
    const mockUrl = `https://billing.stripe.com/p/login/test_live_${customerId}?redirect_success=${encodeURIComponent(
      window.location.origin + '/dashboard/assinatura'
    )}`

    console.log('🔗 Opening mock Stripe portal session:', mockUrl)
    return mockUrl

    // TODO: Uncomment when backend endpoint is ready
    /*
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customerId })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create portal session')
    }

    const { url } = await response.json()
    return url
    */
  } catch (error) {
    console.error('❌ Erro ao criar sessão Stripe Portal:', error)
    throw error
  }
}
