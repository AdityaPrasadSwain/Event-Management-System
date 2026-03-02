const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-slate-800 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
                <p>&copy; {new Date().getFullYear()} Smart Event Management System. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
