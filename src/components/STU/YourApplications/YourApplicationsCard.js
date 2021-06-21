import { forwardRef } from "react";
import { Row, Col, Card, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
	ThreeDotsVertical,
	HourglassSplit,
	XCircleFill,
	CheckCircleFill,
} from "react-bootstrap-icons";
import styles from "./YourApplicationsCard.module.css";

const YourApplicationsCard = ({
	key,
	id,
	stuID,
	jobID,
	status,
	stuAddInfo,
	dateApplied,
}) => {
	const job = {
		title: "pp",
		status: "Approved",
		platform: "Physical",
		multiLocation: false,
		location: "Bukit Panjang",
		postalCode: "123456",
		type: "Ad hoc",
	}; //get jobs where job.id === application.job_id @zech

	return (
		<>
			<div className={styles.container}>
				<Card>
					<Row>
						<Col lg={8}>
							<div className={styles.contentContainer}>
								<div className={styles.topRowContainer}>
									<div className={styles.titleContainer}>
										<h4 className={styles.title}>{job.title}</h4>
										<div
											className={
												status === "Pending"
													? styles.pending
													: styles.displayNone
											}
										>
											<HourglassSplit className={styles.icons} />
											<h6>Status: Pending acceptance from organization</h6>
										</div>
										<div
											className={
												status === "Rejected"
													? styles.rejected
													: styles.displayNone
											}
										>
											<XCircleFill className={styles.icons} />
											<h6>Status: Rejected by organization</h6>
										</div>
										<div
											className={
												status === "Accepted"
													? styles.accepted
													: styles.displayNone
											}
										>
											<CheckCircleFill className={styles.icons} />
											<h6>Status: Accepted</h6>
										</div>
									</div>
									<div className={styles.dotsContainerMobile}>
										<TripleDot id={id} />
									</div>
								</div>

								<h6>Applied on: {new Date(dateApplied).toDateString()}</h6>
								<h6>
									Job status:{" "}
									{job.status !== "Completed" ? "In progress" : "Completed"}
								</h6>

								<h6>
									Location:{" "}
									{job.platform === "Virtual"
										? "Virtual"
										: job.platform === "Physical" && job.multiLocation
										? "Multiple locations"
										: job.platform === "Physical" && !job.multiLocation
										? `${job.location} S(${job.postalCode})`
										: ""}
								</h6>
								<h6>Commitment type: {job.type}</h6>
								<h6>
									Your additional information:
									<br />
									{stuAddInfo}
								</h6>
							</div>
						</Col>
						<Col lg={4}>
							<div className={styles.applicantsContainer}>
								<div className={styles.dotsContainer}>
									<TripleDot id={id} />
								</div>
							</div>
						</Col>
					</Row>
				</Card>
			</div>
		</>
	);
};

export default YourApplicationsCard;

const CustomDropdown = forwardRef(({ children, onClick }, ref) => (
	<a
		href=""
		ref={ref}
		onClick={(event) => {
			event.preventDefault();
			onClick(event);
		}}
	>
		<ThreeDotsVertical className={styles.dots} />
	</a>
));

const TripleDot = ({ id }) => {
	return (
		<Dropdown>
			<Dropdown.Toggle as={CustomDropdown}></Dropdown.Toggle>
			<Dropdown.Menu align="right">
				<Dropdown.Item as={Link} to={`/jobs/${id}`} target="blank">
					View listing
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

// function tConvert(time) {
// 	// Check correct time format and split into components
// 	time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
// 		time,
// 	];

// 	if (time.length > 1) {
// 		// If time format correct
// 		time = time.slice(1); // Remove full string match value
// 		time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
// 		time[0] = +time[0] % 12 || 12; // Adjust hours
// 	}
// 	return time.join(""); // return adjusted time or original string
// }