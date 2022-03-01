import React, { Fragment, useEffect, useState } from "react";

import ShareIcon from "./ShareIcon";
import HomeScreenIcon from "./HomeScreenIcon";

import styles from "./PWAPrompt.styles.scss";

const PWAPrompt = ({
  delay,
  copyTitle,
  copyBody,
  copyAddHomeButtonLabel,
  copyShareButtonLabel,
  copyClosePrompt,
  copyIosChrome,
  permanentlyHideOnDismiss,
  promptData,
  maxVisits,
  onClose,
}) => {
  const [isVisible, setVisibility] = useState(!Boolean(delay));

  useEffect(() => {
    if (delay) {
      setTimeout(() => {
        // Prevent keyboard appearing over the prompt if a text input has autofocus set
        if (document.activeElement) {
          document.activeElement.blur();
        }

        setVisibility(true);
      }, delay);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.classList.add(styles.noScroll);
    }
  }, [isVisible]);

  const isiOS13AndUp = /OS (13|14)/.test(window.navigator.userAgent);
  const visibilityClass = isVisible ? styles.visible : styles.hidden;
  const iOSClass = isiOS13AndUp ? styles.modern : "legacy";

  const isIosChrome = window.navigator.userAgent.match('CriOS') != null;

  const dismissPrompt = (evt) => {
    document.body.classList.remove(styles.noScroll);
    setVisibility(false);

    if (permanentlyHideOnDismiss) {
      localStorage.setItem(
        "iosPwaPrompt",
        JSON.stringify({
          ...promptData,
          visits: maxVisits,
        })
      );
    }

    if (typeof onClose === "function") {
      onClose(evt);
    }
  };

  const onTransitionOut = (evt) => {
    if (!isVisible) {
      evt.currentTarget.style.display = "none";
    }
  };

  return (
    <Fragment>
      <div
        className={`${styles.pwaPromptOverlay} ${visibilityClass} ${iOSClass} iOSPWA-overlay`}
        aria-label="Close"
        role="button"
        onClick={dismissPrompt}
        onTransitionEnd={onTransitionOut}
      />
      <div
        className={`${styles.pwaPrompt} ${visibilityClass} ${iOSClass} iOSPWA-container`}
        aria-describedby="pwa-prompt-description"
        aria-labelledby="pwa-prompt-title"
        role="dialog"
        onTransitionEnd={onTransitionOut}
      >
        <div className={`${styles.pwaPromptHeader} iOSPWA-header`}>
          <p
            id="pwa-prompt-title"
            className={`${styles.pwaPromptTitle} iOSPWA-title`}
          >
            {copyTitle}
          </p>
          <button
            className={`${styles.pwaPromptCancel} iOSPWA-cancel`}
            onClick={dismissPrompt}
          >
            {copyClosePrompt}
          </button>
        </div>
        <div className={`${styles.pwaPromptBody} iOSPWA-body`}>
          <div className={`${styles.pwaPromptDescription} iOSPWA-description`}>
            <p
              id="pwa-prompt-description"
              className={`${styles.pwaPromptCopy} iOSPWA-description-copy`}
            >
              {isIosChrome ? copyIosChrome : copyBody}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PWAPrompt;
