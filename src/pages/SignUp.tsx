
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Get Started</h1>
          <p className="text-muted-foreground mt-2">Create your CogniDoc account</p>
        </div>
        <SignUp 
          fallbackRedirectUrl="/app"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg border border-border bg-card",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
