const dateFilter = (dateStr) => {
  let date = new Date(dateStr);
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

const genderFilter = (gender) => {
  return gender === 1 ? '男':'女'
}



export {
  dateFilter,
  genderFilter
}
