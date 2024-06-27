export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
}

export const getInitials = (name) => {
  if (!name) return ""
  const words = name.split(" ")
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0]
  }

  return initials.toUpperCase()
}

export function formatDate(dateString) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const suffixes = ["th", "st", "nd", "rd"];
  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Determine the correct suffix for the day
  let suffix = suffixes[(day % 10) < 4 ? day % 10 : 0];
  if ([11, 12, 13].includes(day)) {
    suffix = "th";
  }

  return `${day}${suffix} ${month} ${year}`;
}