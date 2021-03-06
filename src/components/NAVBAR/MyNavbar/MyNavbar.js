//IMPORTS
//Bootstrap
import { Navbar, Nav, Tooltip, OverlayTrigger } from "react-bootstrap";
import { HouseFill, EaselFill } from "react-bootstrap-icons";
//React Router
import { Link, NavLink } from "react-router-dom";
//Components
import SignedOutNavbar from "../SignedOutNavbar";
import SignedInStuNavbar from "../SignedInStuNavbar";
import SignedInOrgNavbar from "../SignedInOrgNavbar";
import SignedInAdminNavbar from "../SignedInAdminNavbar";
//Images
import nusccsgplogo from "../../../assets/headerLogos/nusccsgp.png";
//Auth context
import { useAuth } from "../../../contexts/AuthContext";
//CSS Modules
import styles from "./MyNavbar.module.css";

const MyNavbar = () => {
	//CUSTOM HOOKS
	//Retrieve current user details
	const { currentUser, userType } = useAuth();

	//Determining which navbar to render
	const AccountButtons = () => {
		if (currentUser !== null) {
			if (userType === "student") {
				return <SignedInStuNavbar />;
			} else if (userType === "organization") {
				return <SignedInOrgNavbar />;
			} else if (userType === "admin") {
				return <SignedInAdminNavbar />;
			}
		}
		return <SignedOutNavbar />;
	};

	return (
		<div className={styles.navback}>
			<div className={styles.navbar}>
				<Navbar bg="light" variant="light" expand="sm">
					<Navbar.Brand className={styles.desktopDisplayNone}>
						<Link to="/">
							<img
								className={styles.navbarLogo}
								src={nusccsgplogo}
								alt="NUS CCSGP Logo"
							/>
						</Link>
					</Navbar.Brand>
					<Nav className={styles.mobileDisplayNone}>
						<OverlayTrigger placement="bottom" overlay={renderHomeTooltip}>
							<Nav.Link
								as={NavLink}
								activeClassName={styles.activeNavLink}
								exact
								to="/"
							>
								<HouseFill
									style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}
								/>
							</Nav.Link>
						</OverlayTrigger>
						<OverlayTrigger placement="bottom" overlay={renderJobBoardTooltip}>
							<Nav.Link
								as={NavLink}
								activeClassName={styles.activeNavLink}
								exact
								to="/jobs"
							>
								<EaselFill
									style={{ fontSize: "1.2rem", marginBottom: "0.2rem" }}
								/>
							</Nav.Link>
						</OverlayTrigger>
					</Nav>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse className="justify-content-end">
						<Nav className={styles.desktopDisplayNone}>
							<Nav.Link
								as={NavLink}
								activeClassName={styles.activeNavLink}
								exact
								to="/"
							>
								<HouseFill
									style={{
										fontSize: "1.2rem",
										marginBottom: "0.3rem",
									}}
								/>
								<span style={{ marginLeft: "0.4rem" }}>Home</span>
							</Nav.Link>
							<Nav.Link
								as={NavLink}
								activeClassName={styles.activeNavLink}
								exact
								to="/jobs"
							>
								<EaselFill
									style={{
										fontSize: "1.2rem",
										marginBottom: "0.2rem",
									}}
								/>
								<span style={{ marginLeft: "0.4rem" }}>Job Board</span>
							</Nav.Link>
						</Nav>
						<AccountButtons />
					</Navbar.Collapse>
				</Navbar>
			</div>
		</div>
	);
};

export default MyNavbar;

//TOOLTIPS
const renderHomeTooltip = (props) => (
	<Tooltip id="home-tooltip" {...props}>
		Home
	</Tooltip>
);

const renderJobBoardTooltip = (props) => (
	<Tooltip id="job-board-tooltip" {...props}>
		Job Board
	</Tooltip>
);
