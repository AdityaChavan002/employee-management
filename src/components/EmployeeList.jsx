import employees from "../data/employees";

function EmployeeList({ search }) {
  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>
      <h2>Employee List</h2>

      {filteredEmployees.length === 0 ? (
        <p>No employees found</p>
      ) : (
        filteredEmployees.map((employee) => (
          <div key={employee.id}>
            <h3>{employee.name}</h3>

            <p>Email: {employee.email}</p>

            <p>Department: {employee.department}</p>

            <p>Status: {employee.status}</p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default EmployeeList;