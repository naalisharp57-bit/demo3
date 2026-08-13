import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div>
        <p className="font-display text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-foreground px-6 font-600 text-background"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
