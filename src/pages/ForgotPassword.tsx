import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiMail, FiShield, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import { forgotPassword, verifyOTP, resetPassword } from "../utils/api";

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  
  const navigate = useNavigate();

  const startTimer = () => {
    setOtpTimer(600); // 10 minutes in seconds
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await forgotPassword(email);
      setCurrentStep('otp');
      startTimer();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await verifyOTP(email, otp);
      setCurrentStep('reset');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(email, newPassword);
      setCurrentStep('success');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");

    try {
      await forgotPassword(email);
      startTimer();
      setError("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  const renderEmailStep = () => (
    <div className="max-w-sm mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mb-4">
          <FiMail className="text-3xl text-brand" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "SENDING OTP..." : "SEND OTP"}
        </button>
      </form>
    </div>
  );

  const renderOTPStep = () => (
    <div className="max-w-sm mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mb-4">
          <FiShield className="text-3xl text-brand" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
        <p className="text-gray-600">
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
        {otpTimer > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Code expires in: <span className="font-mono text-brand">{formatTime(otpTimer)}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleOTPSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-center text-2xl font-mono tracking-widest"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "VERIFYING..." : "VERIFY OTP"}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={loading || otpTimer > 0}
            className="text-brand hover:text-brand-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {otpTimer > 0 ? `Resend in ${formatTime(otpTimer)}` : "Resend OTP"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderResetStep = () => (
    <div className="max-w-sm mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <FiCheckCircle className="text-3xl text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h2>
        <p className="text-gray-600">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handlePasswordReset} className="space-y-6">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "RESETTING PASSWORD..." : "RESET PASSWORD"}
        </button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="max-w-sm mx-auto text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <FiCheckCircle className="text-3xl text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
      <p className="text-gray-600 mb-6">
        Your password has been successfully reset. You can now log in with your new password.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        GO TO LOGIN
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
          {/* Left Section - Blue Background */}
          <div className="bg-brand p-8 flex flex-col justify-center text-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand to-brand-dark opacity-90"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4">Reset Password</h1>
              <p className="text-lg opacity-90">
                Secure password reset with OTP verification
              </p>
            </div>
          </div>

          {/* Right Section - White Background with Form */}
          <div className="p-8 relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="text-2xl" />
            </button>

            {/* Step Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'email' ? 'bg-brand text-white' : 
                  ['otp', 'reset', 'success'].includes(currentStep) ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`w-16 h-1 ${['otp', 'reset', 'success'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'otp' ? 'bg-brand text-white' : 
                  ['reset', 'success'].includes(currentStep) ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <div className={`w-16 h-1 ${['reset', 'success'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'reset' ? 'bg-brand text-white' : 
                  currentStep === 'success' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
              </div>
            </div>

            {/* Form Content */}
            {currentStep === 'email' && renderEmailStep()}
            {currentStep === 'otp' && renderOTPStep()}
            {currentStep === 'reset' && renderResetStep()}
            {currentStep === 'success' && renderSuccessStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
