export default function Footer() {
  const d = new Date();
const year = d.getFullYear();
  return (
    <footer className="flex items-center justify-center p-1 bg-gray-300 text-white mt-4">
      <p className="text-gray-800">© {year} Ibk. Made with love ❤️</p>
    </footer>
  );
}
