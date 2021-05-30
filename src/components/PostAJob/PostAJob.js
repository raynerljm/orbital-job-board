import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";
import styles from "./PostAJob.module.css";

const PostAJob = () => {
  const [show, setShow] = useState(false);
  const [org, setOrg] = useState("");

  return (
    <Form className={styles.formContainer}>
      <Form.Group controlId="formOrganization">
        <Form.Label>Organization Type</Form.Label>
        <Form.Control
          as="select"
          onChange={(event) => setOrg(event.target.value)}
        >
          <option>NUS Organization</option>
          <option>Non-NUS Organization</option>
        </Form.Control>
      </Form.Group>
      <OrgRender org={org} />
      {/* conditional rendering of {name of group} or {name of org + uen} */}
      <Form.Group controlId="formName">
        <Form.Label>Name of contact person</Form.Label>
        <Form.Control placeholder="John Doe" />
      </Form.Group>
      <Form.Group controlId="formMobileNumber">
        <Form.Label>Mobile number of contact person</Form.Label>
        <Form.Control placeholder="9123 4567" />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Email address of contact person</Form.Label>
        <Form.Control type="email" placeholder="john_doe@organization.com" />
      </Form.Group>
      <Form.Group controlId="formTitle">
        <Form.Label>Title of volunteer work</Form.Label>
        <Form.Control placeholder="Python instructor" />
      </Form.Group>
      <Form.Group controlId="formPurpose">
        <Form.Label>Purpose of volunteer work</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Teach children basic programming skills (elaborate on how students can benefit from volunteering)"
        />
      </Form.Group>
      <Form.Group controlId="formBeneficiary">
        <Form.Label>Target profile of beneficiary</Form.Label>
        <Form.Control placeholder="Children from disadvantaged backgrounds" />
      </Form.Group>
      <Form.Group controlId="formSkills">
        <Form.Label>Skills required</Form.Label>
        <Form.Control placeholder="Intermediate Python programming skills" />
      </Form.Group>
      <Form.Group controlId="formDuration">
        <Form.Label>Duration of volunteer work</Form.Label>
        <Form.Control placeholder="2 months" />
      </Form.Group>
      <Link onClick={() => setShow(true)}>Terms and Conditions of Use</Link>
      <Form.Group controlId="formTerms">
        <Form.Check
          required
          type="checkbox"
          label="I agree with the Terms and Conditions of Use"
          feedback="You must agree with the Terms and Conditions of Use before you can post a job"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Post job
      </Button>
      <TermsModal show={show} onHide={() => setShow(false)} />
    </Form>
  );
};

export default PostAJob;

const OrgRender = ({ org }) => {
  if (org === "NUS Organization") {
    return (
      <Form.Group controlId="formNUSOrg">
        <Form.Label>Name of Student Organization</Form.Label>
        <Form.Control placeholder="NUS Hackers"></Form.Control>
      </Form.Group>
    );
  } else if (org === "Non-NUS Organization") {
    return (
      <>
        <Form.Group controlId="formNonNUSOrg">
          <Form.Label>Name of Organization</Form.Label>
          <Form.Control placeholder="Saturday Kids"></Form.Control>
        </Form.Group>
        <Form.Group controlId="formNonNUSOrgUEN">
          <Form.Label>
            UEN, Charity registration number or Society registration number
          </Form.Label>
          <Form.Control placeholder="TyyCCnnnnX"></Form.Control>
        </Form.Group>
      </>
    );
  } else {
    return <div></div>;
  }
};

const TermsModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Terms and Conditions of Use
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ol>
          <li>Agreement To Terms</li>
          <p>
            All access of any area of "orbital-job-board.vercel.app" ("The
            Website") is governed by the terms and conditions below ("Terms").
            If you do not accept any of these Terms, exit immediately. Continue
            only if you accept these Terms. In these Terms, the words "we",
            "our" and "us" refers to the Government of Singapore.
          </p>
          <li>Access To The Website</li>
          <p>
            The accessibility and operation of The Website relies on
            technologies outside our control. We do not guarantee continuous
            accessibility or uninterrupted operation of The Website.
          </p>
          <li>Relying On Information</li>
          <p>
            We provide The Website as a general information source only and we
            are not involved in giving professional advice here. The Website may
            not cover all information available on a particular issue. Before
            relying on the Website, you should do your own checks or obtain
            professional advice relevant to your particular circumstances.
          </p>
          <li>Security</li>
          <p>
            Where appropriate, we use available technology to protect the
            security of communications made through The Website. However, we do
            not accept liability for the security, authenticity, integrity or
            confidentiality of any transactions and other communications made
            through The Website.
          </p>
          <p>
            Internet communications may be susceptible to interference or
            interception by third parties. Despite our best efforts, we make no
            warranties that The Website is free of infection by computer viruses
            or other unauthorised software.
          </p>
          <p>
            You should take appropriate steps to keep your information, software
            and equipment secure. This includes clearing your Internet browser
            cookies and cache before and after using any services on The
            Website. You should keep your passwords confidential.
          </p>
          <li>Hyperlinks</li>
          <p>
            We are not responsible or liable for the availability or content of
            any other Internet site (not provided by us) linked to or from The
            Website. Access to any other Internet site is at your own risk. If
            you create a link or frame to The Website, you do so at your own
            risk.
          </p>
          <p>
            We reserve the right to object or disable any link or frame to or
            from The Website.
          </p>
          <p>We reserve the right to change the URL of The Website.</p>
          <li>Intellectual Property</li>
          <p>
            Materials, including source code, pages, documents and online
            graphics, audio and video in The Website are protected by law. The
            intellectual property rights in the materials is owned by or
            licensed to us. All rights reserved. (Government of Singapore ©
            2018).
          </p>
          <p>
            Apart from any fair dealings for the purposes of private study,
            research, criticism or review, as permitted in law, no part of The
            Website may be reproduced or reused for any commercial purposes
            whatsoever without our prior written permission.
          </p>
          <li>General Disclaimer And Limitation Of Liability</li>
          <p>
            We will not be liable for any loss or damage{" "}
            <ul>
              <li>
                That you may incur on account of using, visiting or relying on
                any statements, opinion, representation or information in The
                Website;
              </li>
              <li>
                Resulting from any delay in operation or transmission,
                communications failure, Internet access difficulties or
                malfunctions in equipment or software; or
              </li>
              <li>
                Resulting from the conduct or the views of any person who
                accesses or uses The Website.
              </li>
            </ul>
          </p>
          <li>Fees</li>
          <p>
            There are currently no fees for using any part of The Website. We
            reserve the right to introduce new fees from time to time. We are
            not responsible for any fees charged by any other Internet site (not
            provided by us).
          </p>
          <li>Applicable Laws</li>
          <p>
            Use of The Website and these Terms are governed by the laws of
            Singapore. Any claim relating to use of The Website shall be heard
            by Singapore Courts.
          </p>

          <li>Variation</li>
          <p>
            We may revise these Terms at any time by updating this page. You
            should visit this page from time to time and review the then current
            Terms because they are binding on you. We may modify or discontinue
            any information or features that form part of The Website at any
            time, with or without notice to you, and without liability.{" "}
          </p>
        </ol>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};