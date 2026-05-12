function Footer() {
  const styles = {
      footer: {
          backgroundColor: "#09090b",
          borderTop: "1px solid #2a2a2a",
          padding: "1.5rem 2rem",
          textAlign: "center",
          color: "#888888",
          fontSize: "13px",
      },
  };

  return (
      <footer style={styles.footer}>
          <p>PulseFit Gym · Built for strength, recovery, and community.</p>
      </footer>
  );
}

export default Footer;