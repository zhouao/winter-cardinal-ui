/*
 * Copyright (C) 2019 Toshiba Corporation
 * SPDX-License-Identifier: Apache-2.0
 */

import { EShapeDeserializers } from "../e-shape-deserializers";
import { EShapeType } from "../e-shape-type";
import { EShapeUploadeds } from "../e-shape-uploadeds";
import { createGroupUploaded } from "../variant/create-group-uploaded";
import { deserializeEmbedded } from "../variant/deserialize-embedded";

export const loadShapeEmbedded = () => {
	EShapeUploadeds[ EShapeType.EMBEDDED ] = createGroupUploaded;
	EShapeDeserializers[ EShapeType.EMBEDDED ] = deserializeEmbedded;
};