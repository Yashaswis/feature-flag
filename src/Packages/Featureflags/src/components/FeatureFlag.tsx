
import {
  FeatureFlag as OpenFeatureFlag,
} from "@openfeature/react-sdk";

import type { ComponentProps } from "react";

export type FeatureFlagProps = ComponentProps<
  typeof OpenFeatureFlag
>;

// reusable wrapper
export const FeatureFlag = (props: FeatureFlagProps) => {
  return <OpenFeatureFlag {...props} />;
};

