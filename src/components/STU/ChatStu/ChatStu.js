import { useState, useEffect, useRef } from "react";
import ChatStuChat from "./ChatStuChat";
import ChatStuMessage from "./ChatStuMessage";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { Telegram } from "react-bootstrap-icons";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./ChatStu.module.css";
var uniqid = require("uniqid");

const ChatStu = () => {
	const { currentUser } = useAuth();
	const [currentChat, setCurrentChat] = useState();
	// const [chats, setChats] = useState([]);
	const chats = dummyChats;
	const [currentMessages, setCurrentMessages] = useState(dummyMessages);
	const [loadingChats, setLoadingChats] = useState(true);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const newMessageRef = useRef();

	//fetch chats where chat.stuID === currentUser.email
	//fetch messages where message.id === currentChat (set loadingMessages true then false), call everytime currentChat changes (dont replace currentMessages, just append to it)

	const handleSubmit = (event) => {
		event.preventDefault();
		const newMessageID = uniqid();
		const newMessage = {
			id: newMessageID,
			chatID: currentChat,
			fromID: currentUser.email,
			// toID: currentOrgID, //do we need this??
			message: newMessageRef.current.value,
			dateTime: new Date().toUTCString(),
		};

		//push shit here
		setCurrentMessages(currentMessages.concat([newMessage]));
		//push new message into messages
		//update the chat where chat.id === currentChat to have chat.lastDateTime = newMessage.dateTime and chat.lastContent = newMessage.message

		newMessageRef.current.value = "";
	};

	// if (loadingChats) {
	// 	return <div>im loading!</div>
	// }
	return (
		<div className={styles.container}>
			{chats && chats.length > 0 ? (
				<Row>
					<Col lg={4} className={styles.chatCol}>
						<Card className={styles.chatContainer}>
							{chats.map((chat) => (
								<ChatStuChat
									key={chat.id}
									id={chat.id}
									stuID={chat.stuID}
									stuName={chat.stuName}
									orgID={chat.orgID}
									orgName={chat.orgName}
									lastDateTime={chat.lastDateTime}
									lastContent={chat.lastContent}
									setCurrentChat={setCurrentChat}
								/>
							))}
						</Card>
					</Col>
					<Col lg={8} className={styles.messageCol}>
						<Card
							className={
								currentChat
									? styles.messageContainer
									: styles.noMessageContainer
							}
						>
							{!currentChat ? (
								<div>select a msg lol</div>
							) : currentChat && loadingMessages ? (
								<div>loading messages lol</div>
							) : currentChat && currentMessages ? (
								currentMessages.length === 0 ? (
									<div>send a msg or smth!!</div>
								) : (
									currentMessages
										.filter((msg) => msg.chatID === currentChat)
										.sort((msg1, msg2) => {
											return new Date(msg1.dateTime) - new Date(msg2.dateTime);
										})
										.map((msg) => (
											<ChatStuMessage
												key={msg.id}
												id={msg.id}
												chatID={msg.chatID}
												fromID={msg.fromID}
												toID={msg.toID}
												message={msg.message}
												dateTime={msg.dateTime}
											/>
										))
								)
							) : (
								<div>this is a state i was not prepared for</div>
							)}
						</Card>
						<Form onSubmit={handleSubmit}>
							<div
								className={currentChat ? styles.formRow : styles.displayNone}
							>
								<Form.Control ref={newMessageRef} />
								<Button type="submit">
									<Telegram style={{ color: "white" }} />
								</Button>
							</div>
						</Form>
					</Col>
				</Row>
			) : (
				<div> u got no chats lol</div>
			)}
		</div>
	);
};

export default ChatStu;

const dummyChats = [
	{
		id: "1",
		stuID: "raynerljm@u.nus.edu",
		stuName: "Loh Jia Ming, Rayner",
		orgID: "zecharyajw@gmail.com",
		orgName: "Saturday Kids",
		lastDateTime: "Wed, 30 Jun 2021 11:15:30 GMT",
		lastContent:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vehicula eu mi nec maximus. Aliquam non interdum eros, nec scelerisque.",
	},
	{
		id: "2",
		stuID: "raynerljm@u.nus.edu",
		stuName: "Loh Jia Ming, Rayner",
		orgID: "testing@test.com",
		orgName: "Code in the Community",
		lastDateTime: "Wed, 30 Jun 2021 20:10:30 GMT",
		lastContent:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vehicula eu mi nec maximus. Aliquam non interdum eros, nec scelerisque.",
	},
];

const dummyMessages = [
	{
		id: "123",
		chatID: "1",
		fromID: "raynerljm@u.nus.edu",
		toID: "zecharyajw@gmail.com",
		message: "hi!!",
		dateTime: "Wed, 30 Jun 2021 19:10:30 GMT",
	},
	{
		id: "122",
		chatID: "1",
		fromID: "raynerljm@u.nus.edu",
		toID: "zecharyajw@gmail.com",
		message: "hi lol who are u ",
		dateTime: "Wed, 30 Jun 2021 15:09:30 GMT",
	},
	{
		id: "124",
		chatID: "1",
		fromID: "zecharyajw@gmail.com",
		toID: "raynerljm@u.nus.edu",
		message: "idk LOL",

		dateTime: "Wed, 30 Jun 2021 14:08:30 GMT",
	},
	{
		id: "125",

		chatID: "1",
		fromID: "raynerljm@u.nus.edu",
		toID: "zecharyajw@gmail.com",
		message: "hi!! this is a test",
		dateTime: "Wed, 30 Jun 2021 12:00:30 GMT",
	},
	{
		id: "126",
		chatID: "1",
		fromID: "raynerljm@u.nus.edu",
		toID: "zecharyajw@gmail.com",
		message:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et egestas leo. Nullam malesuada tortor viverra, facilisis massa quis, accumsan tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent sodales neque quis lorem consectetur, id ultrices ipsum mollis. Curabitur leo eros, tempus et malesuada quis, accumsan ac dolor. Proin pretium ipsum eu nisi sagittis dapibus. In ut turpis fringilla, commodo mauris quis, lobortis nunc.",
		dateTime: "Wed, 30 Jun 2021 05:15:30 GMT",
	},
	{
		id: "127",
		chatID: "1",
		fromID: "zecharyajw@gmail.com",
		toID: "raynerljm@u.nus.edu",
		message:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et egestas leo. Nullam malesuada tortor viverra, facilisis massa quis, accumsan tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent sodales neque quis lorem consectetur, id ultrices ipsum mollis. Curabitur leo eros, tempus et malesuada quis, accumsan ac dolor. Proin pretium ipsum eu nisi sagittis dapibus. In ut turpis fringilla, commodo mauris quis, lobortis nunc.",
		dateTime: "Wed, 30 Jun 2021 03:59:30 GMT",
	},
	{
		id: "128",
		chatID: "2",
		fromID: "raynerljm@u.nus.edu",
		toID: "zecharyajw@gmail.com",
		message:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et egestas leo. Nullam malesuada tortor viverra, facilisis massa quis, accumsan tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent sodales neque quis lorem consectetur, id ultrices ipsum mollis. Curabitur leo eros, tempus et malesuada quis, accumsan ac dolor. Proin pretium ipsum eu nisi sagittis dapibus. In ut turpis fringilla, commodo mauris quis, lobortis nunc.",
		dateTime: "Wed, 30 Jun 2021 02:15:30 GMT",
	},
	{
		id: "129",
		chatID: "2",
		fromID: "zecharyajw@gmail.com",
		toID: "raynerljm@u.nus.edu",
		message:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et egestas leo. Nullam malesuada tortor viverra, facilisis massa quis, accumsan tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent sodales neque quis lorem consectetur, id ultrices ipsum mollis. Curabitur leo eros, tempus et malesuada quis, accumsan ac dolor. Proin pretium ipsum eu nisi sagittis dapibus. In ut turpis fringilla, commodo mauris quis, lobortis nunc.",
		dateTime: "Wed, 30 Jun 2021 02:59:30 GMT",
	},
];
