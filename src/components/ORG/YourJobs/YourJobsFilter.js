import { useState, useEffect } from "react";
import { Accordion, Card, Form } from "react-bootstrap";
import { ChevronDown, Sliders } from "react-bootstrap-icons";
import styles from "./YourJobsFilter.module.css";

const YourJobsFilter = ({
  values,
  handleChange,
  handleBlur,
  setFilterState,
}) => {
  const [statusOpen, setStatusOpen] = useState(true);
  const [typeOpen, setTypeOpen] = useState(true);
  const [platformOpen, setPlatformOpen] = useState(true);
  const { height, width } = useWindowDimensions();

  return (
    <Form>
      {setFilterState(values)}
      <Accordion defaultActiveKey={width > 768 ? "1" : "0"}>
        <Card className={styles.container}>
          <Accordion.Toggle
            as={Card.Header}
            eventKey="1"
            className={styles.filterHeaderContainer}
          >
            <div className={styles.filterHeaderWrapper}>
              <Sliders />
              <div>Filter</div>
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Card.Title>Filter by</Card.Title>
              {/* Status */}
              <Accordion defaultActiveKey="0">
                <Accordion.Toggle
                  as={Card.Header}
                  eventKey="0"
                  className={styles.filterHeader}
                  onClick={(event) => setStatusOpen(!statusOpen)}
                >
                  Type
                  <div className={statusOpen ? styles.chevUp : styles.chevDown}>
                    <ChevronDown />
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <Form.Group controlId="formStatus">
                      <Form.Check
                        name="pending"
                        label="Pending"
                        checked={values.pending}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.input}
                      />
                      <Form.Check
                        name="approved"
                        label="Approved"
                        checked={values.approved}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.input}
                      />
                      <Form.Check
                        name="completed"
                        label="Completed"
                        checked={values.completed}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.input}
                      />
                      <Form.Check
                        name="rejected"
                        label="Rejected"
                        checked={values.rejected}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.input}
                      />
                      <Form.Check
                        name="takenDown"
                        label="Taken down"
                        checked={values.takenDown}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.input}
                      />
                    </Form.Group>
                  </Card.Body>
                </Accordion.Collapse>
              </Accordion>

              {/* Type */}
              <Accordion defaultActiveKey="0">
                <Accordion.Toggle
                  as={Card.Header}
                  eventKey="0"
                  className={styles.filterHeader}
                  onClick={(event) => setTypeOpen(!typeOpen)}
                >
                  Type
                  <div className={typeOpen ? styles.chevUp : styles.chevDown}>
                    <ChevronDown />
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <Form.Group controlId="formType">
                      <Form.Check
                        name="longTerm"
                        label="Long term"
                        checked={values.longTerm}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.input}
                      />
                      <Form.Check
                        name="adHoc"
                        label="Ad hoc"
                        checked={values.adHoc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.input}
                      />
                    </Form.Group>
                  </Card.Body>
                </Accordion.Collapse>
              </Accordion>
              {/* Platform */}
              <Accordion defaultActiveKey="0">
                <Accordion.Toggle
                  as={Card.Header}
                  eventKey="0"
                  className={styles.filterHeader}
                  onClick={(event) => setPlatformOpen(!platformOpen)}
                >
                  Platform
                  <div
                    className={platformOpen ? styles.chevUp : styles.chevDown}
                  >
                    <ChevronDown />
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <Form.Group controlId="formPlatform">
                      <Form.Check
                        name="physical"
                        label="Physical"
                        checked={values.physical}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.input}
                      />
                      <Form.Check
                        name="virtual"
                        label="Virtual"
                        checked={values.virtual}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.input}
                      />
                    </Form.Group>
                  </Card.Body>
                </Accordion.Collapse>
              </Accordion>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Form>
  );
};

export default YourJobsFilter;

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}