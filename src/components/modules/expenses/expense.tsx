import { useCallback, useState } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import type { CreateEditExpenseInput, IExpense } from "@/utils/models";
import { FE_DATE_FORMAT_MONIFIED } from "@/utils/constants";
import { Edit, Trash2 } from "lucide-react";
import { DeleteExpense } from "./delete-expense";
import { EditExpense } from "./edit-expense";
import { createEditExpense, deleteExpense } from "@/utils/api";
import { useExpense } from "@/utils/contexts/ExpenseProvider";

interface ExpenseProps {
  expense: IExpense;
}

const Expense = (props: ExpenseProps) => {
  const { loadExpenses } = useExpense();
  const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] =
    useState<boolean>(false);
  const [isDeleteExpenseModalOpen, setIsDeleteExpenseModalOpen] =
    useState<boolean>(false);

  const handleEditExpense = (expense: CreateEditExpenseInput) => {
    createEditExpense(expense, "edit")
      ?.then((res) => {
        if (!res?.error) {
          toast("Your expense was updated successfully", {
            position: "top-center",
          });
          setIsEditExpenseModalOpen(false);
          loadExpenses();
        } else {
          toast?.error(
            res?.error ||
              "Something went wrong while updating the expense record",
            {
              position: "top-center",
            }
          );
        }
      })
      ?.catch((error) => {
        toast?.error(
          error?.message ||
            "Something went wrong while updating the expense record",
          {
            position: "top-center",
          }
        );
      });
  };

  const handleDeleteExpense = useCallback(() => {
    if (!props?.expense?.id) return;
    deleteExpense(props?.expense?.id)
      ?.then((res) => {
        if (!res?.error && res?.success) {
          toast("Your expense was deleted successfully", {
            position: "top-center",
          });
          setIsDeleteExpenseModalOpen(false);
          loadExpenses();
        } else {
          toast?.error(
            res?.error ||
              "Something went wrong while deleting the expense record",
            {
              position: "top-center",
            }
          );
        }
      })
      ?.catch((error) => {
        toast?.error(
          error?.message ||
            "Something went wrong while deleting the expense record",
          {
            position: "top-center",
          }
        );
      });
  }, [props?.expense?.id]);

  return !props?.expense?.id ? (
    <></>
  ) : (
    <>
      <div className="grid grid-cols-[7fr_1fr] gap-2">
        <div className="flex flex-col gap-2">
          <EditExpense
            isEditExpenseModalOpen={isEditExpenseModalOpen}
            setIsEditExpenseModalOpen={setIsEditExpenseModalOpen}
            expense={props?.expense}
            trigger={
              <p className="text-sm text-left font-medium text-primary text-wrap line-clamp-2 cursor-pointer hover:underline">
                {props?.expense?.expenseCategoryTitle || "--"}
              </p>
            }
            onCreateOrEdit={handleEditExpense}
          />
          {props?.expense?.updatedAt ? (
            <p className="text-xs">
              {format(
                parseISO(props?.expense?.updatedAt),
                FE_DATE_FORMAT_MONIFIED
              )}
            </p>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col gap-2 items-end">
          <p className="text-lg">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "INR",
            }).format(props?.expense?.amount)}
          </p>
          <div className="flex gap-2 items-center">
            {props?.expense?.id ? (
              <EditExpense
                isEditExpenseModalOpen={isEditExpenseModalOpen}
                setIsEditExpenseModalOpen={setIsEditExpenseModalOpen}
                expense={props?.expense}
                trigger={
                  <Edit
                    size="16"
                    className="text-primary bg-secondary cursor-pointer border-primary hover:border-2 hover:bg-primary hover:text-secondary"
                  />
                }
                onCreateOrEdit={handleEditExpense}
              />
            ) : (
              <></>
            )}
            <DeleteExpense
              isDeleteExpenseModalOpen={isDeleteExpenseModalOpen}
              setIsDeleteExpenseModalOpen={setIsDeleteExpenseModalOpen}
              trigger={
                <Trash2
                  size="16"
                  className="text-primary bg-secondary cursor-pointer border-primary hover:border-2 hover:bg-primary hover:text-secondary"
                />
              }
              onDelete={() => handleDeleteExpense()}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export { Expense };
