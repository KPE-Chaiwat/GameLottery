import MenuButton from "../components/common/4MenuButton";

export default function Home() {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🎮 Primus Game Center</h1>

            <MenuButton label="Game 1" to="/game1" />
            <MenuButton label="Game 2" to="/game2" />
            <MenuButton label="Game 3" to="/game3" />
            <MenuButton label="Game 4" to="/game4" />
            <MenuButton label="Victor Result" to="/victor" />
        </div>
    );
}

const styles = {
    container: {
        paddingTop: "60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    title: {
        marginBottom: "40px",
        color: "#1dbf73",
        fontSize: "32px",
        fontWeight: 700,
    },
};
