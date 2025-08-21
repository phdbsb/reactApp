import { useGetStudentsByRegistrationQuery } from "@/api/endpoints/user";
import { StudentRegistration } from "@/api/endpoints/user/types";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useParams } from "react-router";
import GenericTable from "../GenericTable/GenericTable";

const ProfessorDashboard = () => {
  const { examId } = useParams<{ examId: string }>();
  const { data: students = [] } = useGetStudentsByRegistrationQuery(examId!);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 300,
      renderCell: (params: GridRenderCellParams) => {
        const student = params.row as StudentRegistration;
        return <div>{`${student.firstName} ${student.lastName}`}</div>;
      },
    },
    {
      field: "grade",
      headerName: "Grade",
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const student = params.row as StudentRegistration;
        return <div>{student.grade ?? ""}</div>;
      },
    },
  ];

  return (
    <GenericTable
      title="Prijava"
      rows={students}
      columns={columns}
      getRowId={(row) => row.userId}
    />
  );
};

export default ProfessorDashboard;
