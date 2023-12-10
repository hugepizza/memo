// "use client";
// import { Relation } from "@/app/tpyes/model";
// import { Character } from "@prisma/client";
// import { useContext, useState } from "react";
// import RelationEditerContextProvider, {
//   RelationEditerContext,
// } from "./relation-context";
// import SaveButton, { UpdateButton, DeleteButton } from "../button";
// import toast from "react-hot-toast";

// export default function RelationEditor({
//   memoId,
//   characters,
//   relations,
// }: {
//   memoId: string;
//   characters: Character[];
//   relations: Relation[];
// }) {
//   return (
//     <RelationEditerContextProvider memoId={memoId}>
//       <div className="flex flex-row w-full space-y-1 py-4">
//         <div className="flex flex-col min-w-[60%]">
//           {relations.length > 0 ? (
//             <div className="flex flex-col">
//               <ul>
//                 {relations?.map((c) => (
//                   <li key={c.id}>
//                     <SingleRelationEditor relation={c} />
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ) : (
//             <div className="text-center">No relation yet</div>
//           )}
//         </div>
//         <AddRelation characters={characters} />
//       </div>
//     </RelationEditerContextProvider>
//   );
// }

// function SingleRelationEditor({ relation }: { relation: Relation }) {
//   const { updateRelation, deleteRelation, isRequesting } = useContext(
//     RelationEditerContext
//   );
//   const [relationName, setRelationName] = useState(relation.name ?? "");
//   return (
//     <div className="flex w-full flex-row items-center space-x-1 space-y-1">
//       <CharacterDisplay
//         characters={relation.sourceCharacter}
//       ></CharacterDisplay>

//       <input
//         className="input bg-base-200"
//         value={relationName}
//         onChange={(e) => {
//           setRelationName(e.currentTarget.value);
//         }}
//       />
//       <CharacterDisplay
//         characters={relation.targetCharacter}
//       ></CharacterDisplay>
//       <UpdateButton
//         disable={isRequesting}
//         action={() => {
//           updateRelation(
//             relation.id,
//             relation.sourceCharacter.id,
//             relation.targetCharacter.id,
//             relationName
//           )
//             .then(() => toast.success("Updated!"))
//             .catch((e) => toast.error("Updated failed!"));
//         }}
//       />
//       <DeleteButton
//         disable={isRequesting}
//         action={() => {
//           deleteRelation(relation.id)
//             .then(() => toast.success("Deleted!"))
//             .catch((e) => toast.error("Deleted failed!"));
//         }}
//       />
//       {/* <SaveButton /> */}
//     </div>
//   );
// }

// function CharacterDisplay({ characters }: { characters: Character }) {
//   return <button className="btn w-24 grow">{characters.name}</button>;
// }

// function CharacterSearch({
//   characters,
//   setSelected,
//   placeHolder,
// }: {
//   characters: Character[];
//   setSelected?: (selected: Character) => void;
//   placeHolder?: string;
// }) {
//   const defaultSuggestionLength = 4;
//   const [name, setName] = useState("");
//   const [suggestion, setSuggestion] = useState(false);
//   const [filteredCharacters, setFilteredCharacters] = useState<Character[]>(
//     characters.slice(0, defaultSuggestionLength)
//   );
//   let blurTimeoutId: NodeJS.Timeout;

//   return (
//     <div className="dropdown dropdown-open">
//       <input
//         placeholder={placeHolder ?? "character"}
//         type="text"
//         className="input bg-base-200"
//         value={name}
//         onFocus={() => setSuggestion(true)}
//         onBlur={() => {
//           blurTimeoutId = setTimeout(() => {
//             const current = characters.find((e) => e.name === name);
//             if (setSelected && current) {
//               setSelected(current);
//             }
//             setSuggestion(false);
//           }, 200);
//         }}
//         onChange={(e) => {
//           setName(e.currentTarget.value);
//           if (e.currentTarget.value === "") {
//             setFilteredCharacters(characters.slice(0, defaultSuggestionLength));
//             return;
//           }
//           setFilteredCharacters(
//             characters.filter((ele) => ele.name.includes(e.currentTarget.value))
//           );
//         }}
//       ></input>
//       {filteredCharacters.length > 0 && suggestion && (
//         <ul
//           tabIndex={0}
//           className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-md w-48"
//         >
//           {filteredCharacters.map((e) => (
//             <li
//               className="hover:bg-gray-50"
//               key={e.id}
//               onClick={() => {
//                 setName(e.name);
//                 if (setSelected) {
//                   setSelected(e);
//                 }
//                 setFilteredCharacters([]);
//                 if (blurTimeoutId) {
//                   clearTimeout(blurTimeoutId);
//                 }
//               }}
//             >
//               {e.name}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// function AddRelation({ characters }: { characters: Character[] }) {
//   const [source, setSource] = useState<Character | null>(null);
//   const [target, setTarget] = useState<Character | null>(null);
//   const [relationName, setRelationName] = useState("");
//   const { memoId, addRelation, isRequesting } = useContext(
//     RelationEditerContext
//   );
//   const addAction = () => {
//     if (!(relationName && source && target)) {
//       console.error("params error");
//       return;
//     }
//     addRelation(memoId, source?.id, target?.id, relationName!)
//       .then(() => toast.success("Added!"))
//       .then(() => {
//         setSource(null);
//         setRelationName("");
//         setTarget(null);
//       })
//       .catch(() => toast.error("Added failed!"));
//   };

//   return (
//     <div className="flex flex-col justify-center items-center w-full space-y-1">
//       <CharacterSearch
//         characters={characters}
//         setSelected={setSource}
//         placeHolder="source"
//       />
//       <input
//         type="text"
//         value={relationName}
//         className="input bg-base-200"
//         placeholder="relation name"
//         onChange={(e) => {
//           setRelationName(e.currentTarget.value);
//         }}
//       ></input>
//       <CharacterSearch
//         characters={characters}
//         setSelected={setTarget}
//         placeHolder="target"
//       />
//       <SaveButton action={addAction} disable={isRequesting} />
//     </div>
//   );
// }
