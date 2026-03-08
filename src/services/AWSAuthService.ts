/**
 * AWS Cognito Authentication Service
 * Replaces Firebase Authentication
 */

import { Amplify } from 'aws-amplify';

// Configure Amplify with Cognito settings - v6 format
const COGNITO_CONFIG = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env?.VITE_AWS_COGNITO_USER_POOL_ID || '',
      userPoolClientId: import.meta.env?.VITE_AWS_COGNITO_CLIENT_ID || '',
      identityPoolId: import.meta.env?.VITE_AWS_COGNITO_IDENTITY_POOL_ID || '',
      region: import.meta.env?.VITE_AWS_REGION || 'ap-south-1',
    }
  }
};

// Check if Cognito is configured
export function isCognitoConfigured(): boolean {
  return !!(
    COGNITO_CONFIG.Auth.Cognito.userPoolId &&
    COGNITO_CONFIG.Auth.Cognito.userPoolClientId
  );
}

// Initialize Amplify if configured
if (isCognitoConfigured()) {
  try {
    Amplify.configure(COGNITO_CONFIG);
    console.log('✅ AWS Cognito initialized');
  } catch (error) {
    console.error('❌ Cognito initialization failed:', error);
  }
} else {
  console.log('🔧 Cognito not configured - using mock auth');
}

/**
 * Sign up new user
 */
export async function signUpUser(
  email: string,
  password: string,
  userType: 'buyer' | 'artisan',
  name?: string
) {
  // Amplify v6 uses dynamic imports
  const { signUp } = await import('aws-amplify/auth');
  
  try {
    const { userId, isSignUpComplete } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name: name || email.split('@')[0],
          // Store userType in localStorage instead of custom attribute
        },
      },
    });

    // Store userType in localStorage for app logic
    if (userId) {
      localStorage.setItem('kalaikatha_user_type', userType);
    }

    return {
      success: true,
      userId,
      isSignUpComplete,
    };
  } catch (error: any) {
    console.error('Cognito signup error:', error);
    throw new Error(error.message || 'Signup failed');
  }
}

/**
 * Sign in existing user
 */
export async function signInUser(email: string, password: string) {
  const { signIn } = await import('aws-amplify/auth');
  
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password,
    });

    if (isSignedIn) {
      const user = await getCurrentAuthUser();
      return {
        success: true,
        user,
      };
    }

    // Handle MFA or other confirmation steps if needed
    return {
      success: false,
      nextStep,
    };
  } catch (error: any) {
    console.error('Cognito signin error:', error);
    throw new Error(error.message || 'Sign in failed');
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  const { signOut } = await import('aws-amplify/auth');
  
  try {
    await signOut();
    return { success: true };
  } catch (error: any) {
    console.error('Cognito signout error:', error);
    throw new Error(error.message || 'Sign out failed');
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentAuthUser() {
  const { getCurrentUser } = await import('aws-amplify/auth');
  
  try {
    // getCurrentUser returns { userId, username, signInDetails }
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Update user display name in Cognito
 */
export async function updateUserName(name: string) {
  const { updateUserAttributes } = await import('aws-amplify/auth');
  
  try {
    await updateUserAttributes({
      userAttributes: {
        name,
      },
    });
    return { success: true };
  } catch (error: any) {
    console.warn('Cognito updateUserAttributes failed:', error.message);
    throw error;
  }
}

/**
 * Confirm signup with OTP code
 */
export async function confirmSignUpOTP(email: string, confirmationCode: string) {
  const { confirmSignUp } = await import('aws-amplify/auth');
  
  try {
    await confirmSignUp({
      username: email,
      confirmationCode,
    });
    return { success: true };
  } catch (error: any) {
    console.error('Cognito OTP confirmation error:', error);
    throw new Error(error.message || 'OTP verification failed');
  }
}

/**
 * Resend confirmation code to user's email
 */
export async function resendConfirmationCode(email: string) {
  const { resendSignUpConfirmationCode } = await import('aws-amplify/auth');
  
  try {
    const result = await resendSignUpConfirmationCode({
      username: email,
    });
    return { success: true, codeDeliveryDetails: result.codeDeliveryDetails };
  } catch (error: any) {
    console.error('Cognito resend code error:', error);
    throw new Error(error.message || 'Failed to resend code');
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const authUser = await getCurrentAuthUser();
    return !!authUser;
  } catch {
    return false;
  }
}
