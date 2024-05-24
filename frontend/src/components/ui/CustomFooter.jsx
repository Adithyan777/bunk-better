import { Link as RouterLink } from "react-router-dom";

export default function CustomFooter() {
  return (
    <footer className="fixed bottom-0 left-0 w-full flex items-center justify-center border-t p-4">
      <p className="text-sm">
        Built by{" "}
        <a className="font-medium" href="https://github.com/Adithyan777" target="_blank" rel="noopener noreferrer">
          adithyn
        </a>
        . The source code is available on{" "}
        <a className="font-medium" href="https://github.com/Adithyan777/bunk-better" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>
    </footer>
  );
}
