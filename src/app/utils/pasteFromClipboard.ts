export const pasteFromClipboard = async (): Promise<string | null> => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: "clipboard-read" as PermissionName });
      if (permissionStatus.state === "denied") {
        throw new Error("Clipboard permission denied");
      }
      const text = await navigator.clipboard.readText();
      return text.trim() ? text : null;
    } catch (error) {
      console.log("Error accessing clipboard:", error);
      return null;
    }
  };