const config = {
  dossier: {
    visible: [
      // Alles was hier NICHT drin steht ist automatisch VISIBLE
      {
        fieldName: "family",
        dependsOn: "businessUnit",
        condition: ["Home Care", "Beauty Care"]
      },
      {
        fieldName: "baseType",
        dependsOn: "businessUnit",
        condition: ["Home Care"]
      },
      {
        fieldName: "baseType",
        dependsOn: "category",
        condition: ["Möp"]
      }
    ],
    mandatory: [
      // Alles was hier NICHT drin steht ist automatisch NICHT MANDATORY
      {
        fieldName: "businessUnit"
      },
      {
        fieldName: "countries"
      },
      {
        fieldName: "manufacturer",
        dependsOn: "privateLabel",
        condition: ["false"]
      },
      {
        fieldName: "retailer",
        dependsOn: "privateLabel",
        condition: ["true"]
      }
    ]
  }
};

function doMagic(configs, fieldName, product, defaultValue) {
  let found = undefined;
  let fieldConfig = configs.filter((conf) => conf.fieldName === fieldName);
  if (fieldConfig && fieldConfig.length) {
    for (const conf of fieldConfig) {
      if (!!found) {
        break;
      }
      found =
        !conf.condition ||
        conf.condition.some(
          (c) =>
            c.replace(/\s/g, "").toLocaleLowerCase() ===
            (product[conf.dependsOn].name || product[conf.dependsOn])
              .toString()
              .replace(/\s/g, "")
              .toLocaleLowerCase()
        );
    }
  }
  if (found === undefined) {
    return defaultValue || false;
  }
  return found;
}

function getFieldConfiguration(product, fieldName, context) {
  return {
    fieldName,
    required: doMagic(config[context].mandatory, fieldName, product, false),
    visible: doMagic(config[context].visible, fieldName, product, true)
  };
}

const product = {
  category: {
    name: "123"
  },
  privateLabel: false,
  businessUnit: {
    name: "Oral Care"
  }
};

console.clear();
console.log(getFieldConfiguration(product, "manufacturer", "dossier"));
console.log(getFieldConfiguration(product, "retailer", "dossier"));
console.log(getFieldConfiguration(product, "businessUnit", "dossier"));
console.log(getFieldConfiguration(product, "family", "dossier"));
console.log(getFieldConfiguration(product, "countries", "dossier"));
