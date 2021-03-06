import React, { useContext, useState } from "react";
import { BeneficiaryTags, SkillTags } from "../Constants";
import { useAuth } from "./AuthContext";
import noAvatar from "../assets/emptyStates/noAvatar.png";

const StuContext = React.createContext();

export function useStu() {
  return useContext(StuContext);
}

export function StuProvider({ children }) {
  const { token } = useAuth();

  async function getStudent(email) {
    try {
      const studentData = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/student-accounts/${email}`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      const student = await studentData.json();
      return student;
    } catch (err) {
      console.error(err);
    }
  }

  async function getSubscriptions(email) {
    try {
      const subscriptionData = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/student-accounts/subscriptions/${email}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      const subscriptionsObject = await subscriptionData.json();
      const subscriptions = subscriptionsObject.subscriptions;
      console.log(subscriptions);

      let subs = {};
      if (subscriptions) {
        for (let i = 0; i < BeneficiaryTags.length; i++) {
          if (subscriptions.includes(BeneficiaryTags[i])) {
            subs[BeneficiaryTags[i]] = true;
          } else {
            subs[BeneficiaryTags[i]] = false;
          }
        }
        for (let j = 0; j < SkillTags.length; j++) {
          if (subscriptions.includes(SkillTags[j])) {
            subs[SkillTags[j]] = true;
          } else {
            subs[SkillTags[j]] = false;
          }
        }
      }
      console.log("Printing subs");
      console.log(subs);
      return subs;
    } catch (err) {
      console.error(err);
    }
  }

  async function updateSubscriptions(email, subscriptions, unsubscriptions) {
    const body = {
      subscriptions,
      unsubscriptions,
    };
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/student-accounts/update-subscriptions/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function updateStudentAccount(email, updated) {
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/student-accounts/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updated),
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function applyForJob(jobId, email, newApp) {
    const updateApplicants = {
      student_id: email,
    };
    const updateApplied = {
      jobID: jobId,
    };

    const sendApp = { newApp: newApp };

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/job-applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sendApp),
      });

      /*
      await fetch(process.env.REACT_APP_BACKEND_URL + "/jobs/apply/" + jobId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer: ${token}`,
        },
        body: JSON.stringify(updateApplicants),
      });

      await fetch(
        process.env.REACT_APP_BACKEND_URL +
          "/student-accounts/apply-job/" +
          email,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateApplied),
        }
      );
      */
    } catch (err) {
      console.log(err);
    }
  }

  async function getAppForJob(jobId, email) {
    try {
      const myAppData = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/job-applications/${jobId}&${email}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      const myApp = await myAppData.json();
      console.log(myApp);
      return myApp;
    } catch (e) {
      console.log(e);
    }
  }

  async function getStuChats(id) {
    try {
      const stuChatData = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/chats/all-chats/student/${id}`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      const stuChats = await stuChatData.json();
      var processedChats = stuChats;
      processedChats.forEach((chat) => {
        chat.date = new Date(chat.date);
      });
      processedChats.forEach((chat) => {
        if (id === chat.fromID) {
          chat.subtitle = `You: ${chat.subtitle}`;
        }
      });
      processedChats.forEach((chat) => {
        if (!chat.avatar) {
          chat.avatar = noAvatar;
        }
      });
      processedChats.forEach((chat) => {
        if (!(chat.title && chat.title.length > 0)) {
          chat.title = "<No name>";
        }
      });
      return processedChats;
    } catch (err) {
      console.log(err);
    }
  }

  async function getStuMessages(currentChat, myId) {
    try {
      const messagesData = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/chats/messages/${currentChat}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      const messages = await messagesData.json();
      var processedMessages = [...messages];
      processedMessages.forEach((msg) => {
        msg.date = new Date(msg.date);
      });
      processedMessages.forEach((msg) => {
        if (myId === msg.fromID) {
          msg.position = "right";
        } else {
          msg.position = "left";
        }
      });
      return processedMessages;
    } catch (err) {
      console.log(err);
    }
  }

  async function postChat(body) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/chats`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      console.log("Posted");
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async function checkExists(stuId, orgId) {
    try {
      const alreadyExistsData = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/chats/already-exists/${stuId}&${orgId}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      const alreadyExists = await alreadyExistsData.json();
      return alreadyExists;
    } catch (err) {
      console.log(err);
    }
  }

  async function postMessage(currentChatID, backendMessage) {
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/chats/${currentChatID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(backendMessage),
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function getYourApps(id) {
    try {
      const appData = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/job-applications/student/${id}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      const apps = await appData.json();
      return apps;
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteApps(appID, stuID, jobID) {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/job-applications`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: appID, stuID: stuID, jobID: jobID }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  const value = {
    getStudent,
    getSubscriptions,
    updateSubscriptions,
    updateStudentAccount,
    getYourApps,
    applyForJob,
    getAppForJob,
    getStuChats,
    getStuMessages,
    postChat,
    checkExists,
    postMessage,
    deleteApps,
  };

  return <StuContext.Provider value={value}>{children}</StuContext.Provider>;
}
