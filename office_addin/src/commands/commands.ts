/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global Office */

Office.onReady(() => {
  // If needed, Office.js is ready to be called.
});

/**
 * Shows a notification when the add-in command is executed.
 * This is used for Outlook quick actions
 * @param event
 */
function action(event: Office.AddinCommands.Event) {
  const message: Office.NotificationMessageDetails = {
    type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
    message: "Kenneth AI action performed.",
    icon: "Icon.80x80",
    persistent: true,
  };

  // Show a notification message (Outlook only)
  if (Office.context.mailbox && Office.context.mailbox.item) {
    Office.context.mailbox.item.notificationMessages.replaceAsync(
      "ActionPerformanceNotification",
      message
    );
  }

  // Be sure to indicate when the add-in command function is complete.
  event.completed();
}

// Register the function with Office.
if (Office.actions) {
  Office.actions.associate("action", action);
}
