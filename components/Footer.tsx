export default function Footer() {
  return (
    <footer className="bg-purple-700 text-white p-4 text-center">
      <p>&copy; {new Date().getFullYear()} UNIQUEWIN.CO.UK</p>
      <div>
        <a href="#" className="mx-2 hover:text-orange-300">Terms & Conditions</a>
        <a href="#" className="mx-2 hover:text-orange-300">Privacy Policy</a>
        <a href="#" className="mx-2 hover:text-orange-300">Responsible Gaming</a>
        <a href="#" className="mx-2 hover:text-orange-300">Contact Us</a>
      </div>
    </footer>
  );
}