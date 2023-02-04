import { Field } from "formik";

import { CustomFieldTypes } from "@/utils/types/shared.types";

const FieldComponent: React.FC<CustomFieldTypes> = ({
  validations: _validations,
  validationtype: _validationtype,
  classnames = {
    description: "",
    input: "",
    label: "",
    option: "",
    wrapper: "",
  },
  ...props
}) => {
  switch (props.type) {
    case "text":
    case "email":
    case "date":
    case "number":
    case "file":
    case "password":
    case "textarea": {
      return (
        <div className={classnames?.wrapper ?? ""}>
          {props.label && (
            <label htmlFor={props.id} className={classnames?.label ?? ""}>
              {props.label}
            </label>
          )}
          {props.type === "textarea" ? (
            <Field
              {...props}
              component="textarea"
              className={`${classnames?.input ?? ""}`}
            />
          ) : (
            <Field {...props} className={`${classnames?.input ?? ""}`} />
          )}

          {props.description && (
            <p className={classnames?.description ?? ""}>{props.description}</p>
          )}
        </div>
      );
    }

    case "select": {
      return (
        <div className={classnames?.wrapper}>
          {props.label && (
            <label htmlFor={props.id} className={classnames?.label ?? ""}>
              {props.label}
            </label>
          )}
          <Field {...props} as="select" className={classnames?.input ?? ""}>
            <option
              disabled
              hidden
              selected
              className={classnames?.option ?? ""}
              value=""
            >
              {props.placeholder ?? "Select"}
            </option>
            {props.choices?.map((choice) => (
              <option
                key={choice.value.trim()}
                className={classnames?.option ?? ""}
                value={choice.value}
              >
                {choice.text}
              </option>
            ))}
          </Field>

          {props.description && (
            <p className={classnames?.description ?? ""}>{props.description}</p>
          )}
        </div>
      );
    }

    case "radio":
    case "checkbox": {
      return (
        <div className={classnames?.wrapper ?? ""} role="group">
          {props.choices.map((choice) => (
            <label
              key={`${props.name}.${choice.value}`}
              htmlFor={`${props.name}.${choice.value}`}
              className={classnames?.label ?? ""}
            >
              <Field
                {...props}
                id={`${props.name}.${choice.value}`}
                placeholder={props.placeholder ?? ""}
                value={choice.value}
                className={classnames?.option ?? ""}
              />
              <div className="inline-block">{choice.text} </div>
            </label>
          ))}

          {props.description && (
            <p className={classnames?.description ?? ""}>{props.description}</p>
          )}
        </div>
      );
    }

    default: {
      return <></>;
    }
  }
};

export default FieldComponent;
