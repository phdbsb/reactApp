import { useGetStudentsByRegistrationQuery } from "@/api/endpoints/user";
import { StudentRegistration } from "@/api/endpoints/user/types";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useParams } from "react-router";
import GenericTable from "../GenericTable/GenericTable";
import { useUserImages } from "@/hooks/useUserImages";
import styles from "./style.module.css";
import { Avatar, TextField } from "@mui/material";
import { useUpdateGradeMutation } from "@/api/endpoints/registrations";
import { ChangeEvent, FocusEvent, FocusEventHandler, useState } from "react";

const ProfessorDashboard = () => {
  const { examId } = useParams<{ examId: string }>();
  const { data: students = [] } = useGetStudentsByRegistrationQuery(examId!);
  const [updateGrade] = useUpdateGradeMutation();

  const studentImages = students.map((student) => ({
    userId: student.userId,
    imagePath: student.imagePath,
  }));

  const { imageMap } = useUserImages(studentImages);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 300,
      renderCell: (params: GridRenderCellParams) => {
        const student = params.row as StudentRegistration;
        const avatarUrl = imageMap[student.userId];
        return (
          <div className={styles["userName"]}>
            <Avatar
              src={avatarUrl}
              sx={{ width: 32, height: 32, marginRight: 1 }}
            />
            <div>{`${student.firstName} ${student.lastName}`}</div>
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 300,
      renderCell: (params: GridRenderCellParams) => {
        const student = params.row as StudentRegistration;
        return <div>{student.email}</div>;
      },
    },
    {
      field: "grade",
      headerName: "Grade",
      width: 200,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const student = params.row as StudentRegistration;

        const [localGrade, setLocalGrade] = useState<string>(
          student.grade?.toString() ?? ""
        );

        const handleLocalChange = (e: ChangeEvent<HTMLInputElement>) => {
          setLocalGrade(e.target.value);
        };

        const handleBlur = async (e: FocusEvent<HTMLInputElement>) => {
          const value = e.target.value;

          const newGrade = Number(value);

          const result = await updateGrade({
            userId: student.userId,
            examId: examId!,
            grade: newGrade,
          });

          if (result.data?.grade === null) {
            setLocalGrade(student.grade?.toString() ?? ""); 
          } else {
            student.grade = newGrade;
          }
        };

        return (
          <div className={styles["gradeInput"]}>
            <TextField
              type="number"
              placeholder=""
              value={localGrade}
              size="small"
              variant="standard"
              fullWidth={true}
              style={{ width: 80 }}
              onChange={handleLocalChange}
              onBlur={handleBlur}
              className={styles.centeredInput}
              slotProps={{
                input: {
                  style: { textAlign: "center" },
                },
              }}
            />
          </div>
        );
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
