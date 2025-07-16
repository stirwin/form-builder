import Link from "next/link"

function Logo() {
  return (
    <Link
      href={"/"}
      className="font-extrabold text-3xl text-foreground hover:opacity-80 transition-opacity" // Cambios aquí: color sólido y efecto hover
    >
      Tecnoform
    </Link>
  )
}

export default Logo
