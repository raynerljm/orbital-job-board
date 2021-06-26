import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import YourJobsCard from "./YourJobsCard";
import YourJobsFilter from "./YourJobsFilter";
import { LoadingYourJobs, NoYourJobs, FilterNoYourJobs } from "./EmptyStates";
import styles from "./YourJobs.module.css";
import { Formik } from "formik";
import { useAuth } from "../../../contexts/AuthContext";

const YourJobs = () => {
	const [filterState, setFilterState] = useState({});
	const { currentUser } = useAuth();

	const [jobs, setJobs] = useState({});
	const [jobLoading, setJobLoading] = useState(true);

	const getYourJobs = async () => {
		const response = await fetch(
			process.env.REACT_APP_BACKEND_URL +
				"/jobs/organization/" +
				currentUser.email
		);
		const jsonData = await response.json();
		setJobs(jsonData);
		setJobLoading(false);
	};

	useEffect(() => {
		getYourJobs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (jobLoading) {
		return <LoadingYourJobs />;
	} else if (jobs.length < 1) {
		return <NoYourJobs />;
	}

	//filter
	const filteredJobs = jobs
		.filter((job) => (!filterState.pending ? job.status !== "Pending" : true))
		.filter((job) => (!filterState.approved ? job.status !== "Approved" : true))
		.filter((job) =>
			!filterState.completed ? job.status !== "Completed" : true
		)
		.filter((job) => (!filterState.rejected ? job.status !== "Rejected" : true))
		.filter((job) =>
			!filterState.takenDown ? job.status !== "TakenDown" : true
		)
		.filter((job) => (!filterState.longTerm ? job.type !== "Long term" : true))
		.filter((job) => (!filterState.adHoc ? job.type !== "Ad hoc" : true))
		.filter((job) =>
			!filterState.physical ? job.platform !== "Physical" : true
		)
		.filter((job) => (!filterState.virtual ? job.platform !== "Virtual" : true))
		.sort(
			//sort by recent creation first
			(job1, job2) => new Date(job2.dateCreated) - new Date(job1.dateCreated)
		)
		.sort((job1, job2) => {
			// sort by pending first
			var job1State = job1.status === "Pending" ? 1 : 0;
			var job2State = job2.status === "Pending" ? 1 : 0;
			return job2State - job1State;
		});
	// for formik
	var initialValues = {
		pending: true,
		approved: true,
		completed: true,
		rejected: true,
		takenDown: true,
		longTerm: true,
		adHoc: true,
		physical: true,
		virtual: true,
	};

	return (
		<div className={styles.container}>
			<Row className={styles.rowContainer}>
				<Col md={3} className={styles.firstColContainer}>
					<div className={styles.filterContainer}>
						<Formik initialValues={initialValues}>
							{({ values, handleChange, handleBlur }) => (
								<YourJobsFilter
									values={values}
									handleChange={handleChange}
									handleBlur={handleBlur}
									setFilterState={setFilterState}
								/>
							)}
						</Formik>
					</div>
				</Col>
				<Col md={9} className={styles.secondColContainer}>
					{filteredJobs.length >= 1 ? (
						filteredJobs.map((job) => (
							<YourJobsCard
								key={job.id}
								id={job.id}
								status={job.status}
								title={job.title}
								beneficiaries={job.beneficiaries}
								skills={job.skills}
								purpose={job.purpose}
								platform={job.platform}
								multiLocation={job.multiLocation}
								location={job.location}
								postalCode={job.postalCode}
								type={job.type}
								flexiDate={job.flexiDate}
								longStartDate={job.longStartDate}
								longEndDate={job.longEndDate}
								flexiHours={job.flexiHours}
								longHours={job.longHours}
								adShift={job.adShift}
								addInfo={job.addInfo}
								imageUrl={job.imageUrl}
								pocName={job.pocName}
								pocNo={job.pocNo}
								pocEmail={job.pocEmail}
								dateCreated={job.dateCreated}
								datePosted={job.datePosted}
								applicants={job.applicants}
							/>
						))
					) : (
						<div className={styles.emptyState}>
							<FilterNoYourJobs />
						</div>
					)}
				</Col>
			</Row>
		</div>
	);
};

export default YourJobs;
