import Link from "react-router-dom"

export default function CustomFooter() {
  return (
    <footer className="flex items-center justify-center border-t p-4">
      <p className="text-sm">
        Built by
        <Link className="font-medium" to="https://github.com/Adithyan777">
          adithyn
        </Link>
        . The source code is available on{" "}
        <Link className="font-medium" to="https://github.com/Adithyan777/bunk-better">
          GitHub
        </Link>
        .{"\n      "}
      </p>
    </footer>
  )
}