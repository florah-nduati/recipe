import React from "react";
import PasswordUpdateForm from "../../components/passwordUpdate/passwordUpdate";
import Create from "../../components/create/create";
import PersonalInformationUpdateForm from "../../components/updatePersonalInformation/personalInformation";

function Settings() {
  return (
    <div className="settings">
      <Create />
      <PersonalInformationUpdateForm />
      <PasswordUpdateForm />
    </div>
  );
}

export default Settings;
