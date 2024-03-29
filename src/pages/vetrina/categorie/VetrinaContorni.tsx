import React from "react";
import { SimpleGrid, Text } from "@chakra-ui/react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IngredientModel } from "../../../models/IngredientModel";
import { _firestore } from "../../../utils/firebase";
import IngredientInfoCard from "../../shop-components/main-section/restaurant-components/IngredientInfoCard";

interface VetrinaProps {}

const VetrinaContorni: React.FC<VetrinaProps> = () => {
  const vetrinaRef = _firestore
    .collection("/vetrina-ingredients")
    .where("phase", "==", "contorni");
  const [vetrinaIngredients] = useCollectionData<IngredientModel>(vetrinaRef);

  return (
    <>
      <Text fontStyle="italic">
        È raccomandato il consumo di 5 porzioni al giorno tra frutta e verdura.
        Ricorda di rispettare sempre la stagionalità e la varietà!
      </Text>
      <SimpleGrid columns={[1, 4]} columnGap="3">
        {vetrinaIngredients &&
          vetrinaIngredients.map((ingredient, index) => {
            const { imageURI, name, price, vegetarian, vegan } = ingredient;
            return (
              <IngredientInfoCard
                availableIngredient={ingredient}
                imageURI={imageURI}
                iteratorKey={index}
                key={index}
                name={name}
                price={price}
                vegan={vegan}
                vegetarian={vegetarian}
              />
            );
          })}
      </SimpleGrid>
    </>
  );
};

export default VetrinaContorni;
