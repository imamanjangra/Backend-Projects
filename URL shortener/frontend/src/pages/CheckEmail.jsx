import { Mail } from "lucide-react";

export default function CheckEmail() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-100 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl text-center">

        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-800">
          Check Your Email
        </h1>

        <p className="mt-4 text-gray-500 leading-relaxed">
          We've sent a verification link to your email address.
          Please open your inbox and click the link to verify your account.
        </p>

        <div className="mt-8 rounded-2xl bg-gray-100 p-4 text-sm text-gray-600">
          If you don't see the email, check your spam folder.
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          I've Verified My Email
        </button>
      </div>
    </div>
  );
}