from dataclasses import dataclass, field
from typing import List
import warnings


@dataclass
class Opportunity:
    id: str = ""
    updatedAt: str = ""
    expiryDate: str = ""
    name: str = ""
    problem: str = ""
    need: str = ""
    plan: str = ""
    why: str = ""
    country: str = ""
    challengeLength: str = ""
    isDateFlexible: str = ""
    isLocationFlexible: str = ""
    isLocationRemote: str = ""
    expectedTimeForSupport: str = ""
    description: str = ""

    def loadFromDict(self, input_json: dict):
        for attr in self.__dataclass_fields__.keys():
            if attr in input_json:
                setattr(self, attr, input_json[attr])
            else:
                warnings.warn(f"{self.id} is missing {attr}", Warning)


@dataclass
class Profile:
    id: str = ""
    name: str = ""
    profession: str = ""
    town: str = ""
    country: str = ""
    about: str = ""
    featured: str = ""
    groups: List[str] = field(default_factory=list)
    opportunitiesParticipating: List[str] = field(default_factory=list)
    openTo: List[str] = field(default_factory=list)
    skills: List[str] = field(default_factory=list)
    languages: List[str] = field(default_factory=list)
    industryInterests: List[str] = field(default_factory=list)
    causeInterests: List[str] = field(default_factory=list)

    def loadFromDict(self, input_json: dict):
        for attr in self.__dataclass_fields__.keys():
            if attr in input_json:
                setattr(self, attr, input_json[attr])
            else:
                warnings.warn(f"{self.id} is missing {attr}", Warning)
