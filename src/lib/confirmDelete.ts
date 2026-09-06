import Swal from "sweetalert2";

/**
 * Show a SweetAlert2 delete confirmation dialog.
 * Returns true if the user clicked "Yes, Delete!", false otherwise.
 */
export async function confirmDelete(message?: string): Promise<boolean> {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: message ?? "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#3f3f46",
    background: "#ffffff",
    color: "#1e293b",
    backdrop: "rgba(0, 0, 0, 0.75)",
    iconColor: "#f59e0b",
    buttonsStyling: true,
    reverseButtons: true,
    customClass: {
      popup: "swal2-nexura-popup",
      title: "swal2-nexura-title",
      htmlContainer: "swal2-nexura-text",
    },
  });

  return result.isConfirmed;
}
