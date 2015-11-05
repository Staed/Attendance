module.exports = {
  getRow: function(row) {
    late = '';
    if (row.late > 0) late = row.late;

    return '<td>' + row.meeting_id + '</td><td>' + row.employee_id + '</td><td>' + row.date + '</td>'
  }
}
