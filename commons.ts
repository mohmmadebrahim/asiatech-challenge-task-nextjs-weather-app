export const convertTime = (timeStamp: number) => {
  const date = new Date(timeStamp * 1000);
  const hours = date.getHours().toString();
  const mins = date.getMinutes().toString();

  return {
    hours: formatTime(hours),
    mins: formatTime(mins),
  };
};
export const formatTime = (time: number | string) => {
  return time.toString().length === 1 ? "0" + time : time;
};
export const checkValidEmail = (email: string) => {
  return (
    email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) !== null
  );
};

export const checkValidPassword = (password: string) => {
  return password.length >= 3;
};

export const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const getToken = () => {
  const isToken = localStorage.getItem("token")
  return isToken
}
