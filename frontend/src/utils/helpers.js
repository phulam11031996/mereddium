import { useEffect } from "react";
import axios from "axios";

export const getCookie = (name) => {
  var cookieArr = document.cookie.split(";");

  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");

    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
};

export const useDynamicHeightField = (element, value) => {
  useEffect(() => {
    if (!element) return;

    element.current.style.height = "auto";
    element.current.style.height = element.current.scrollHeight + "px";
  }, [element, value]);
};

export const parseCookie = (str) =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

export const makeCommentCall = async (newComment) => {
  try {
    const response = await axios.post(
      "http://localhost:3030/comment/",
      newComment,
      { headers: { Authorization: `Basic ${getCookie("jwt")}` } }
    );
    return response;
  } catch (error) {
    return false;
  }
};

export const deletePostById = (id) => {
  makePostDeleteCall(id).then((response) => {
    if (response.status === 200) {
      console.log("Sucessfully Deleted!");
      window.location = "/";
    }
  });
};

export const makePostDeleteCall = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:3030/post/${id}`, {
      headers: { Authorization: `Basic ${getCookie("jwt")}` },
    });
    return response;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const makePostCall = async (post) => {
  try {
    const response = await axios.post("http://localhost:3030/post", post, {
      headers: { Authorization: `Basic ${getCookie("jwt")}` },
    });
    return response;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const handleSortByTime = async () => {
  try {
    const response = await axios.get(`http://localhost:3030/post/`);
    let result = response.data.data;
    let filtered = result.sort((p1, p2) => {
      const time1 = new Date(p1.createdAt);
      const time2 = new Date(p2.createdAt);
      return time2 - time1;
    });

    return filtered;
  } catch (e) {
    console.log(e);
  }
};

export const handleSortByVote = async () => {
  try {
    const response = await axios.get(`http://localhost:3030/post/`);
    let result = response.data.data;
    let filtered = result.sort((p1, p2) => {
      return (
        p2.upVoteUsers.length -
        p2.downVoteUsers.length -
        (p1.upVoteUsers.length - p1.downVoteUsers.length)
      );
    });

    return filtered;
  } catch (e) {
    console.log(e);
  }
};

export const handleSortByTrending = async () => {
  try {
    const response = await axios.get(`http://localhost:3030/post/`);
    let result = response.data.data;
    let filtered = result
      .filter((post) => {
        const time = new Date(post.createdAt);
        var threshold = new Date();
        threshold.setDate(threshold.getDate() - 30);
        return time > threshold;
      })
      .sort((p1, p2) => {
        return (
          p2.upVoteUsers.length -
          p2.downVoteUsers.length -
          (p1.upVoteUsers.length - p1.downVoteUsers.length)
        );
      });

    return filtered;
  } catch (e) {
    console.log(e);
  }
};

export const handleSearch = async (searchKey) => {
  try {
    const response = await axios.get(`http://localhost:3030/post/`);
    let result = response.data.data;
    let filtered = result.filter((post) => {
      return post.title.toLowerCase().match(searchKey.toLowerCase());
    });

    return filtered;
  } catch (e) {
    console.log(e);
  }
};

export const handleSavedPosts = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:3030/user/saved/${userId}`
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const makeSignUpCall = async (user) => {
  try {
    const response = await axios.post(
      "http://localhost:3030/auth/signup",
      user
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const monthToString = (month) => {
  switch (month) {
    case "01":
      return "Jan";
    case "02":
      return "Feb";
    case "03":
      return "Mar";
    case "04":
      return "Apr";
    case "05":
      return "May";
    case "06":
      return "Jun";
    case "07":
      return "Jul";
    case "08":
      return "Aug";
    case "09":
      return "Sep";
    case "10":
      return "Oct";
    case "11":
      return "Nov";
    case "12":
      return "Dec";
    default:
      return "";
  }
};
