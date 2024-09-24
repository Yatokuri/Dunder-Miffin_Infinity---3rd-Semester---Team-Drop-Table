

function Footer() {
    return (
        <footer style={{ position: 'absolute', bottom: 25, width: '99%' }} className="footer footer-center">
            <p>© 2023 - 2024</p>
            <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                <a href="https://www.linkedin.com/in/naylin-hla/">LinkedIn</a>
                <a href="https://github.com/NaylinHla">Github</a>
                <a href="https://chatgpt.com/">Sources</a>
            </div>
        </footer>
    );
}

export default Footer;
