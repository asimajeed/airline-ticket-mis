import FormInput from "./FormInput";

const LoginForm = ({
  email,
  password,
  setEmail,
  setPassword,
  handleSignIn,
  toggleTab,
}: {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSignIn: () => void;
  toggleTab: (tab: string) => void;
}) => (
  <>
    <FormInput
      label="Email address"
      type="email"
      value={email}
      onChange={(e: any) => setEmail(e.target.value)}
    />
    <FormInput
      label="Password"
      type="password"
      value={password}
      onChange={(e: any) => setPassword(e.target.value)}
      onEnterPress={handleSignIn}
    />
    <div className="flex justify-between mb-4">
      <label className="flex items-center text-white">
        <input type="checkbox" className="mr-2" />
        Remember me
      </label>
      <a
        onClick={() => alert("Good luck bozo")}
        className="text-white"
      >
        Forgot password?
      </a>
    </div>
    <button
      className="w-full py-2 text-white bg-theme-primary-darker rounded font-semibold"
      onClick={handleSignIn}
    >
      Sign in
    </button>
    <p className="text-center mt-4 text-slate-100">
      Not a member?{" "}
      <button
        className="text-white font-semibold"
        onClick={() => toggleTab("register")}
      >
        Register
      </button>
    </p>
  </>
);

export default LoginForm;
