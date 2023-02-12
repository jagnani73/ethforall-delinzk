/* eslint-disable @next/next/no-img-element */

import type { ProfileUsernameProps } from "@/utils/types/profile.types";

const ProfileUsername: React.FC<ProfileUsernameProps> = ({ employee }) => {
  return (
    <main>
      <article>
        <figure>
          <img
            src={employee.photo}
            alt={`${employee.username} on deLinZK`}
            height={360}
            width={360}
          />
        </figure>

        <figcaption>
          {employee.name} as {employee.username}
        </figcaption>

        <p>{employee.email}</p>

        <p>{employee.industry}</p>

        <p>{employee.about}</p>
      </article>
    </main>
  );
};

export default ProfileUsername;
