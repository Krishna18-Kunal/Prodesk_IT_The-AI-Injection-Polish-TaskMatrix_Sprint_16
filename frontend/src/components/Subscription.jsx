
import { useState } from 'react';
import { Check, Crown, Sparkles, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Subscription({ onClose }) {
  const { user, token, refreshUser } = useAuth();
  const [processing, setProcessing] = useState(false);

  const isPremium =
    user?.subscriptionPlan === 'premium' &&
    user?.subscriptionStatus === 'active';

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleUpgrade = async () => {
    try {
      setProcessing(true);

      const loaded = await loadRazorpay();

      if (!loaded) {
        toast.error('Unable to load payment gateway. Try again.');
        return;
      }

      const data = await apiRequest('/payments/create-order', {
        token,
        method: 'POST',
        body: JSON.stringify({ amount: 9900 })
      });

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'TaskMatrix',
        description: 'Premium Subscription - 30 Days',
        order_id: data.order.id,

        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },

        theme: {
          color: '#9279f5'
        },

        handler: async (response) => {
          try {
            await apiRequest('/payments/verify', {
              token,
              method: 'POST',
              body: JSON.stringify(response)
            });

            await refreshUser();

            toast.success('Premium activated successfully!');
            onClose?.();
          } catch (error) {
            toast.error(
              error.message || 'Payment verification failed'
            );
          }
        },

        modal: {
          ondismiss: () => {
            toast.info('Payment window closed.');
          }
        }
      };

      const checkout = new window.Razorpay(options);

      checkout.on('payment.failed', (response) => {
        toast.error(
          response.error?.description ||
          'Payment failed. Please try again.'
        );
      });

      checkout.open();

    } catch (error) {
      toast.error(error.message || 'Unable to start payment.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card subscription-card">

        <div className="modal-head">
          <div>
            <span className="eyebrow">
              TASKMATRIX MEMBERSHIP
            </span>
            <h2>Upgrade your productivity</h2>
          </div>

          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="premium-plan">

          <div className="premium-icon">
            <Crown size={26} />
          </div>

          <span className="premium-label">
            PREMIUM PLAN
          </span>

          <h1>
            Rs99 <small>/ 30 days</small>
          </h1>

          <p>
            Unlock more ways to work smarter with TaskMatrix.
          </p>

          <div className="premium-features">
            <div>
              <Check size={16} />
              Advanced AI task suggestions
            </div>

            <div>
              <Check size={16} />
              Smart productivity workflow
            </div>

            <div>
              <Check size={16} />
              Premium member status
            </div>

            <div>
              <Check size={16} />
              30 days of Premium access
            </div>

            <div>
              <ShieldCheck size={16} />
              Secure Razorpay checkout
            </div>
          </div>

          {isPremium ? (
            <div className="premium-active">
              <ShieldCheck size={18} />
              Premium Active

              {user?.subscriptionExpiry && (
                <small>
                  Expires:{' '}
                  {new Date(
                    user.subscriptionExpiry
                  ).toLocaleDateString()}
                </small>
              )}
            </div>
          ) : (
            <button
              className="primary-btn premium-upgrade-btn"
              onClick={handleUpgrade}
              disabled={processing}
            >
              <Sparkles size={17} />

              {processing
                ? 'Preparing payment...'
                : 'Upgrade for Rs99'}
            </button>
          )}

          <small className="payment-note">
            Secure payment | 30-day access | Razorpay checkout
          </small>

        </div>
      </div>
    </div>
  );
}
