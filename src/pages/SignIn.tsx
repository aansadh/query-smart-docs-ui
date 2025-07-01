
import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your CogniDoc account</p>
        </div>
        <SignIn 
          fallbackRedirectUrl="/app"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg border border-border bg-card text-card-foreground",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-background border border-border text-foreground hover:bg-accent",
              socialButtonsBlockButtonText: "text-foreground",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border border-border text-foreground focus:border-ring",
              footerActionLink: "text-primary hover:text-primary/80",
              footerActionText: "text-muted-foreground",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-primary hover:text-primary/80",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              formResendCodeLink: "text-primary hover:text-primary/80",
              otpCodeFieldInput: "bg-background border border-border text-foreground",
              alternativeMethodsBlockButton: "text-primary hover:text-primary/80",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignInPage;
