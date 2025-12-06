export const getPostTimeAgo = (post) => {
  const time = post.status === "approved" ? post.approvedAt : null;
  if (!time) return "Chờ duyệt";

  const now = Date.now();
  const d = new Date(time);
  const diff = now - d.getTime();

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  if (days <= 7) return `${days} ngày trước`;

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
};

export const getTimeAgo = (date) => {
  if (!date) return "Không xác định";

  const now = Date.now();
  const d = new Date(date);
  const diff = now - d.getTime();

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  if (days <= 7) return `${days} ngày trước`;

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
};

export const convertDate = (date) => {
  const d = new Date(date);
  const vnTime = new Date(d.getTime() + 7 * 60 * 60 * 1000);

  const yyyy = vnTime.getFullYear();
  const mm = String(vnTime.getMonth() + 1).padStart(2, "0");
  const dd = String(vnTime.getDate()).padStart(2, "0");
  const hh = String(vnTime.getHours()).padStart(2, "0");
  const min = String(vnTime.getMinutes()).padStart(2, "0");
  const ss = String(vnTime.getSeconds()).padStart(2, "0");

  return `${hh}:${min}:${ss} ${dd}-${mm}-${yyyy} `;
};

export const isToday = (date) => {
  const today = new Date().toISOString().split("T")[0];
  return date === today;
};

export const isTomorrow = (date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  return date === tomorrowStr;
};

export const isThisWeek = (date) => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const d = new Date(date);
  return d >= weekStart && d <= weekEnd;
};

export const isThisMonth = (date) => {
  const now = new Date();
  const d = new Date(date);
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

export const isThisYear = (date) => {
  const now = new Date();
  const d = new Date(date);
  return d.getFullYear() === now.getFullYear();
};
